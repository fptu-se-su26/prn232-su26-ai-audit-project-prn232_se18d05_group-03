// Realistic 3D floor-plan view for F1, with Floor → Room → Bed drill-down.
// Loaded on demand via Blazor JS isolation:  import('./js/floorplan3d.js')
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Layout coords are 0–100 in both X and Y; map onto a 100×100 floor centered at origin.
function wx(x) { return x - 50; }
function wz(y) { return y - 50; }

const STATUS_COLOR = {
    Available:    0x16a34a,
    Occupied:     0xdc2626,
    Cleaning:     0xd97706,
    OutOfService: 0x9ca3af
};
function statusColor(s) { return STATUS_COLOR[s] ?? 0x64748b; }

let S = null;

// ── HTML label (CSS2D) ──────────────────────────────────────────────────────
function makeTag(text, kind) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.cssText = kind === 'room'
        ? 'padding:3px 8px;border-radius:7px;background:rgba(255,255,255,.92);border:1px solid rgba(0,0,0,.15);'
          + 'font:700 12px Inter,sans-serif;color:#1f2937;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.18);'
        : 'padding:1px 6px;border-radius:6px;background:rgba(17,24,39,.82);'
          + 'font:700 10px Inter,sans-serif;color:#fff;white-space:nowrap;';
    div.style.pointerEvents = 'none';
    return new CSS2DObject(div);
}

// ── detailed bed ────────────────────────────────────────────────────────────
function makeBed(x, z, bw, bd, status, id) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);

    const frame = new THREE.Mesh(
        new RoundedBoxGeometry(bw, 0.7, bd, 3, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x8a94a6, roughness: 0.5, metalness: 0.3 })
    );
    frame.position.y = 0.55;
    frame.castShadow = true; frame.receiveShadow = true;
    g.add(frame);

    const mattress = new THREE.Mesh(
        new RoundedBoxGeometry(bw * 0.9, 0.32, bd * 0.94, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 })
    );
    mattress.position.y = 1.05;
    mattress.castShadow = true; mattress.receiveShadow = true;
    g.add(mattress);

    // blanket — colored by status (covers the foot ~60%)
    const blanket = new THREE.Mesh(
        new RoundedBoxGeometry(bw * 0.92, 0.22, bd * 0.58, 3, 0.08),
        new THREE.MeshStandardMaterial({ color: statusColor(status), roughness: 0.6 })
    );
    blanket.position.set(0, 1.24, bd * 0.16);
    blanket.castShadow = true;
    blanket.userData.bedId = id;
    g.add(blanket);

    const pillow = new THREE.Mesh(
        new RoundedBoxGeometry(bw * 0.5, 0.2, bd * 0.2, 3, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
    );
    pillow.position.set(0, 1.24, -bd * 0.32);
    g.add(pillow);

    const head = new THREE.Mesh(
        new RoundedBoxGeometry(bw, 1.0, 0.18, 3, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6, metalness: 0.2 })
    );
    head.position.set(0, 0.7, -bd / 2 + 0.02);
    head.castShadow = true;
    g.add(head);

    return { group: g, blanket };
}

// ── gradient background texture ─────────────────────────────────────────────
function gradientBg() {
    const c = document.createElement('canvas');
    c.width = 8; c.height = 256;
    const ctx = c.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, '#f4f7fb');
    grd.addColorStop(1, '#d7dee8');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 8, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

// ── privacy curtain (local frame: head at -z, aisle toward +z / +x) ─────────
function makeCurtain(bw, bd) {
    const g = new THREE.Group();
    const cloth = new THREE.MeshStandardMaterial({
        color: 0x5eddc9, roughness: 0.85, transparent: true, opacity: 0.34,
        side: THREE.DoubleSide, depthWrite: false
    });
    const rail = new THREE.MeshStandardMaterial({ color: 0x9aa3af, roughness: 0.4, metalness: 0.6 });
    const H = 3.4, TOP = 4.0;

    const foot = new THREE.Mesh(new THREE.BoxGeometry(bw * 1.4, H, 0.05), cloth);
    foot.position.set(0, TOP - H / 2, bd * 0.66); foot.renderOrder = 1; g.add(foot);
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.05, H, bd * 1.05), cloth);
    side.position.set(bw * 0.78, TOP - H / 2, bd * 0.06); side.renderOrder = 1; g.add(side);

    const rf = new THREE.Mesh(new THREE.BoxGeometry(bw * 1.45, 0.08, 0.08), rail);
    rf.position.set(0, TOP, bd * 0.66); g.add(rf);
    const rs = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, bd * 1.12), rail);
    rs.position.set(bw * 0.78, TOP, bd * 0.06); g.add(rs);
    return g;
}

// ── bedside medical equipment (local frame: head at -z) ─────────────────────
function makeEquipment(bw, bd) {
    const g = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: 0xb8bfca, roughness: 0.4, metalness: 0.6 });

    // monitor on a pole
    const mp = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 10), metal);
    mp.position.set(bw * 0.72, 1.1, -bd * 0.32); mp.castShadow = true; g.add(mp);
    const screen = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.75, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.35, emissive: 0x0e7490, emissiveIntensity: 0.6 })
    );
    screen.position.set(bw * 0.72, 2.35, -bd * 0.32); screen.castShadow = true; g.add(screen);

    // IV stand + bag
    const iv = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.0, 10), metal);
    iv.position.set(-bw * 0.82, 1.5, -bd * 0.3); iv.castShadow = true; g.add(iv);
    const bag = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.55, 0.14),
        new THREE.MeshStandardMaterial({ color: 0xdcefff, roughness: 0.5, transparent: true, opacity: 0.7 })
    );
    bag.position.set(-bw * 0.82, 2.7, -bd * 0.3); g.add(bag);

    // bedside cabinet
    const cab = new THREE.Mesh(
        new RoundedBoxGeometry(0.85, 1.0, 0.85, 3, 0.06),
        new THREE.MeshStandardMaterial({ color: 0xcbb89a, roughness: 0.7 })
    );
    cab.position.set(bw * 0.92, 0.5, -bd * 0.02); cab.castShadow = true; cab.receiveShadow = true; g.add(cab);
    return g;
}

// ── in-room WC cubicle (absolute coords) ────────────────────────────────────
function makeBathroom(group, cx, cz, sq, corSignZ, room, labels) {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: 0.85 });
    const doorMat = new THREE.MeshStandardMaterial({
        color: 0x88b8c8, roughness: 0.85, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false
    });
    const HH = 2.6;

    // interior partition on the -x side (facing the room)
    const wallA = new THREE.Mesh(new RoundedBoxGeometry(0.28, HH, sq, 2, 0.05), wallMat);
    wallA.position.set(cx - sq / 2, HH / 2, cz);
    wallA.castShadow = true; wallA.receiveShadow = true; wallA.userData.roomNumber = room;
    group.add(wallA);

    // translucent curtain-door on the room-center-facing side
    const door = new THREE.Mesh(new THREE.BoxGeometry(sq, HH - 0.2, 0.06), doorMat);
    door.position.set(cx, (HH - 0.2) / 2, cz - corSignZ * sq / 2);
    door.renderOrder = 1; door.userData.roomNumber = room;
    group.add(door);

    // floor tile
    const tile = new THREE.Mesh(
        new THREE.BoxGeometry(sq, 0.12, sq),
        new THREE.MeshStandardMaterial({ color: 0xeaf0f4, roughness: 0.5, metalness: 0.05 })
    );
    tile.position.set(cx, 0.24, cz); tile.receiveShadow = true; group.add(tile);

    // toilet + sink
    const toilet = new THREE.Mesh(
        new RoundedBoxGeometry(0.7, 0.8, 0.9, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    toilet.position.set(cx + sq * 0.22, 0.65, cz + corSignZ * sq * 0.22);
    toilet.castShadow = true; group.add(toilet);
    const sink = new THREE.Mesh(
        new RoundedBoxGeometry(0.6, 0.25, 0.4, 3, 0.06),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
    );
    sink.position.set(cx - sq * 0.22, 1.0, cz + corSignZ * sq * 0.28);
    sink.castShadow = true; group.add(sink);

    const tag = makeTag('WC', 'bed');
    tag.position.set(cx, HH + 1.0, cz);
    group.add(tag); labels.push(tag);
}

// ── window on the outer wall (glass panel + frame) ──────────────────────────
function makeWindow(cx, z, span) {
    const g = new THREE.Group();
    const glass = new THREE.Mesh(
        new THREE.BoxGeometry(span, 2.2, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xbfe3f5, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.5, depthWrite: false })
    );
    glass.position.set(cx, 3.0, z); glass.renderOrder = 1; g.add(glass);
    const fmat = new THREE.MeshStandardMaterial({ color: 0x8a94a6, roughness: 0.5, metalness: 0.4 });
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 0.14), fmat);
    mullion.position.set(cx, 3.0, z); g.add(mullion);
    const sill = new THREE.Mesh(new THREE.BoxGeometry(span + 0.3, 0.16, 0.24), fmat);
    sill.position.set(cx, 1.9, z); g.add(sill);
    return g;
}

// ── doorway frame on the corridor wall ──────────────────────────────────────
function makeDoor(cx, z, room) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5, metalness: 0.3 });
    const DW = 3.0, DH = 3.4;
    for (const sx of [-DW / 2, DW / 2]) {
        const post = new THREE.Mesh(new RoundedBoxGeometry(0.25, DH, 0.65, 2, 0.05), mat);
        post.position.set(cx + sx, DH / 2, z); post.castShadow = true; post.userData.roomNumber = room;
        g.add(post);
    }
    const lintel = new THREE.Mesh(new RoundedBoxGeometry(DW + 0.25, 0.35, 0.65, 2, 0.05), mat);
    lintel.position.set(cx, DH, z); lintel.userData.roomNumber = room; g.add(lintel);
    return g;
}

// ── potted plant ────────────────────────────────────────────────────────────
function makePlant(x, z) {
    const g = new THREE.Group();
    const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.34, 0.7, 12),
        new THREE.MeshStandardMaterial({ color: 0xb5651d, roughness: 0.85 })
    );
    pot.position.set(x, 0.6, z); pot.castShadow = true; g.add(pot);
    const foliage = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.75, 0),
        new THREE.MeshStandardMaterial({ color: 0x2f9e44, roughness: 0.85, flatShading: true })
    );
    foliage.position.set(x, 1.55, z); foliage.castShadow = true; g.add(foliage);
    return g;
}

// ── scene build ─────────────────────────────────────────────────────────────
function buildScene(payload) {
    const scene = new THREE.Scene();
    scene.background = gradientBg();
    scene.fog = new THREE.Fog(0xd7dee8, 180, 320);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x8090a0, 0.5);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(-45, 85, 35);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const d = 90;
    sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;   sun.shadow.camera.bottom = -d;
    sun.shadow.camera.near = 1;  sun.shadow.camera.far = 320;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(180, 180),
        new THREE.MeshStandardMaterial({ color: 0xe8ebf0, roughness: 0.6, metalness: 0.05 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    const labels = [];   // CSS2DObjects to remove/GC on dispose
    const rooms = new Map();
    const bedMeshes = new Map();

    // corridor / nurse / stairs slabs
    function slab(rect, color, h, y, rough = 0.9) {
        const m = new THREE.Mesh(
            new RoundedBoxGeometry(rect.w, h, rect.h, 2, 0.15),
            new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 })
        );
        m.position.set(wx(rect.x + rect.w / 2), y, wz(rect.y + rect.h / 2));
        m.receiveShadow = true;
        return m;
    }
    if (payload.corridor) scene.add(slab(payload.corridor, 0xd7d2c4, 0.25, 0.12, 1));
    if (payload.nurse) {
        const ns = slab(payload.nurse, 0x93c5fd, 3, 1.5, 0.5);
        ns.castShadow = true; scene.add(ns);
        const t = makeTag('Trạm Y tá', 'bed');
        t.position.set(wx(payload.nurse.x + payload.nurse.w / 2), 5, wz(payload.nurse.y + payload.nurse.h / 2));
        scene.add(t); labels.push(t);
    }
    if (payload.stairs) { const st = slab(payload.stairs, 0xb7add0, 4, 2, 0.5); st.castShadow = true; scene.add(st); }

    const WALL_H = 5.5;
    for (const r of payload.rooms) {
        const w = r.w, dp = r.h;
        const cx = wx(r.x + r.w / 2), cz = wz(r.y + r.h / 2);
        const col = new THREE.Color(r.color || '#94a3b8');

        const group = new THREE.Group();
        group.userData.roomNumber = r.room;

        // tinted floor slab
        const slabMesh = new THREE.Mesh(
            new RoundedBoxGeometry(w, 0.35, dp, 2, 0.12),
            new THREE.MeshStandardMaterial({ color: col.clone().lerp(new THREE.Color(0xffffff), 0.62), roughness: 0.75, metalness: 0.05 })
        );
        slabMesh.position.set(cx, 0.17, cz);
        slabMesh.receiveShadow = true;
        slabMesh.userData.roomNumber = r.room;
        group.add(slabMesh);

        // translucent "glass" walls — reveal beds inside at overview
        const glassMat = new THREE.MeshStandardMaterial({
            color: col.clone().lerp(new THREE.Color(0xffffff), 0.25),
            roughness: 0.08, metalness: 0.0,
            transparent: true, opacity: 0.24, depthWrite: false, side: THREE.DoubleSide
        });
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5, metalness: 0.3 });
        const WT = 0.5;
        const walls = [
            { w: w,  d: WT, x: cx,         z: cz - dp / 2 },
            { w: w,  d: WT, x: cx,         z: cz + dp / 2 },
            { w: WT, d: dp, x: cx - w / 2, z: cz },
            { w: WT, d: dp, x: cx + w / 2, z: cz }
        ];
        for (const s of walls) {
            const glass = new THREE.Mesh(new RoundedBoxGeometry(s.w, WALL_H, s.d, 2, 0.08), glassMat);
            glass.position.set(s.x, WALL_H / 2, s.z);
            glass.renderOrder = 2;
            glass.userData.roomNumber = r.room;
            group.add(glass);
            // solid base rail at the bottom of the wall
            const rail = new THREE.Mesh(new RoundedBoxGeometry(s.w, 0.6, s.d, 2, 0.06), frameMat);
            rail.position.set(s.x, 0.3, s.z);
            rail.castShadow = true; rail.receiveShadow = true;
            rail.userData.roomNumber = r.room;
            group.add(rail);
        }

        // ── room geometry references ──
        const corSignZ = cz < 0 ? 1 : -1;               // +z/-z toward the central corridor
        const outerSignZ = -corSignZ;
        const corridorWallZ = cz + corSignZ * dp / 2;
        const outerWallZ = cz + outerSignZ * dp / 2;
        const leftWallX = cx - w / 2, rightWallX = cx + w / 2;

        // WC cubicle in the corridor-side + right corner
        const wcSq = Math.min(w, dp) * 0.26;
        const wcCx = rightWallX - wcSq / 2 - 0.3;
        const wcCz = corridorWallZ - corSignZ * (wcSq / 2 + 0.3);
        makeBathroom(group, wcCx, wcCz, wcSq, corSignZ, r.room, labels);

        // window on the outer wall + door on the corridor wall (offset from WC) + plant
        group.add(makeWindow(cx, outerWallZ, Math.min(w * 0.5, 8)));
        group.add(makeDoor(cx - w * 0.18, corridorWallZ, r.room));
        group.add(makePlant(leftWallX + 1.2, outerWallZ - outerSignZ * 1.4));

        // ── beds along the LEFT & RIGHT walls, heads to wall, feet to centre aisle ──
        const beds = r.beds || [];
        const n = beds.length;
        if (n) {
            const bd = Math.max(2.4, Math.min(6.5, (w - 4.5) / 2));   // bed length (across x)
            const inset = 0.7, marginZ = 1.6;

            // central aisle rug
            const aisle = Math.max(2, w - 2 * bd - 2 * inset);
            const rug = new THREE.Mesh(
                new THREE.BoxGeometry(aisle, 0.1, dp * 0.7),
                new THREE.MeshStandardMaterial({ color: 0xcfe3ea, roughness: 0.9 })
            );
            rug.position.set(cx, 0.27, cz); rug.receiveShadow = true; group.add(rug);

            const place = (list, wallX, sideSign, reserveCor) => {
                const count = list.length;
                if (!count) return;
                const usable = Math.max(count, dp - 2 * marginZ - reserveCor);
                const step = usable / count;
                const bw = Math.min(step * 0.82, 5.5);
                const bedX = wallX - sideSign * (bd / 2 + inset);   // bed centre x
                const zStart = outerWallZ - outerSignZ * marginZ;
                list.forEach((b, j) => {
                    const bz = zStart - outerSignZ * step * (j + 0.5);
                    const built = makeBed(bedX, bz, bw, bd, b.status, b.id);
                    built.group.add(makeCurtain(bw, bd));
                    built.group.add(makeEquipment(bw, bd));
                    built.group.rotation.y = sideSign < 0 ? Math.PI / 2 : -Math.PI / 2;  // head to wall
                    group.add(built.group);
                    bedMeshes.set(b.id, built.blanket);

                    // over-bed ceiling light (emissive → subtle bloom)
                    const light = new THREE.Mesh(
                        new THREE.BoxGeometry(bd * 0.5, 0.12, bw * 0.5),
                        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff2cc, emissiveIntensity: 0.9 })
                    );
                    light.position.set(bedX, WALL_H - 0.3, bz); group.add(light);

                    // bed-number sign on the head wall
                    if (b.label) {
                        const bl = makeTag(b.label, 'bed');
                        bl.position.set(wallX - sideSign * 0.5, 2.4, bz);
                        group.add(bl); labels.push(bl);
                    }
                });
            };

            const leftCount = Math.ceil(n / 2);
            place(beds.slice(0, leftCount), leftWallX, -1, 0);          // left wall (head → -x)
            place(beds.slice(leftCount), rightWallX, 1, wcSq + 1);      // right wall, clear of WC
        }

        // room number + type tag (floats above centre)
        const tag = makeTag(`${r.room} · ${r.type || ''}`.trim(), 'room');
        tag.position.set(cx, WALL_H + 2.5, cz);
        group.add(tag);
        labels.push(tag);

        scene.add(group);
        rooms.set(r.room, { group, rect: { cx, cz } });
    }

    return { scene, rooms, bedMeshes, labels, sun };
}

// ── public API ──────────────────────────────────────────────────────────────
export function render(container, payload, dotNetRef) {
    dispose();

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 480;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const built = buildScene(payload);
    const scene = built.scene;

    // soft image-based lighting
    let envRT = null;
    try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = envRT.texture;
        pmrem.dispose();
    } catch (e) { /* env optional */ }

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    const OVERVIEW_POS = new THREE.Vector3(0, 96, 98);
    const OVERVIEW_LOOK = new THREE.Vector3(0, 0, 0);
    camera.position.copy(OVERVIEW_POS);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 22;
    controls.maxDistance = 260;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.target.copy(OVERVIEW_LOOK);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    let userInteracted = false;
    controls.addEventListener('start', () => { userInteracted = true; controls.autoRotate = false; });

    // CSS2D label overlay
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(w, h);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    // post-processing (guarded — fall back to plain render if it fails)
    let composer = null, ssao = null, bloom = null, outline = null;
    try {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        ssao = new SSAOPass(scene, camera, w, h);
        ssao.kernelRadius = 6; ssao.minDistance = 0.003; ssao.maxDistance = 0.09;
        composer.addPass(ssao);
        bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.22, 0.7, 0.92);
        composer.addPass(bloom);
        outline = new OutlinePass(new THREE.Vector2(w, h), scene, camera);
        outline.edgeStrength = 3.5; outline.edgeGlow = 0.2; outline.edgeThickness = 1.2;
        outline.visibleEdgeColor.set('#2563eb'); outline.hiddenEdgeColor.set('#1e40af');
        composer.addPass(outline);
        composer.addPass(new OutputPass());
    } catch (e) { composer = null; }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0, downY = 0;

    let anim = null;
    function flyTo(toPos, toLook) {
        anim = { fromPos: camera.position.clone(), toPos: toPos.clone(),
                 fromLook: controls.target.clone(), toLook: toLook.clone(), t: 0, dur: 0.6 };
        controls.enabled = false;
    }

    S = {
        container, renderer, camera, controls, built, scene,
        composer, ssao, bloom, outline, labelRenderer, envRT,
        OVERVIEW_POS, OVERVIEW_LOOK, dotNetRef, focused: null,
        _raf: 0, stop: () => cancelAnimationFrame(S._raf)
    };

    function pick(e) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        return raycaster.intersectObjects(scene.children, true);
    }

    function enterRoom(roomNumber, notify) {
        const entry = built.rooms.get(roomNumber);
        if (!entry) return;
        S.focused = roomNumber;
        controls.autoRotate = false;
        flyTo(new THREE.Vector3(entry.rect.cx, 34, entry.rect.cz + 40),
              new THREE.Vector3(entry.rect.cx, 0, entry.rect.cz));
        if (notify) S.dotNetRef.invokeMethodAsync('SelectRoomFromJs', roomNumber);
    }
    function leaveRoom() {
        S.focused = null;
        if (!userInteracted) controls.autoRotate = true;
        flyTo(OVERVIEW_POS, OVERVIEW_LOOK);
    }
    S.enterRoom = enterRoom;
    S.leaveRoom = leaveRoom;

    function onMove(e) {
        if (!outline) return;
        const hits = pick(e);
        for (const hit of hits) {
            const ud = hit.object.userData || {};
            if (ud.bedId) { outline.selectedObjects = [hit.object]; renderer.domElement.style.cursor = 'pointer'; return; }
            if (ud.roomNumber && !S.focused) { outline.selectedObjects = [hit.object]; renderer.domElement.style.cursor = 'pointer'; return; }
        }
        outline.selectedObjects = [];
        renderer.domElement.style.cursor = '';
    }
    function onDown(e) { downX = e.clientX; downY = e.clientY; }
    function onUp(e) {
        if (Math.abs(e.clientX - downX) > 4 || Math.abs(e.clientY - downY) > 4) return;
        const hits = pick(e);
        for (const hit of hits) {
            const ud = hit.object.userData || {};
            if (ud.bedId) { S.dotNetRef.invokeMethodAsync('SelectBedFromJs', ud.bedId); return; }
            if (ud.roomNumber && !S.focused) { enterRoom(ud.roomNumber, true); return; }
        }
    }
    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);
    S.onMove = onMove; S.onDown = onDown; S.onUp = onUp;

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    S.ro = ro;

    let last = performance.now();
    function loop(now) {
        S._raf = requestAnimationFrame(loop);
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        if (anim) {
            anim.t = Math.min(1, anim.t + dt / anim.dur);
            const k = anim.t < 0.5 ? 2 * anim.t * anim.t : 1 - Math.pow(-2 * anim.t + 2, 2) / 2;
            camera.position.lerpVectors(anim.fromPos, anim.toPos, k);
            controls.target.lerpVectors(anim.fromLook, anim.toLook, k);
            if (anim.t >= 1) { anim = null; controls.enabled = true; }
        }
        controls.update();
        if (composer) composer.render(); else renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }
    S._raf = requestAnimationFrame(loop);
}

export function focusRoom(room) { if (S) S.enterRoom(room, false); }
export function exitRoom()      { if (S) S.leaveRoom(); }

export function resize() {
    if (!S) return;
    const w = S.container.clientWidth || 800;
    const h = S.container.clientHeight || 480;
    S.camera.aspect = w / h;
    S.camera.updateProjectionMatrix();
    S.renderer.setSize(w, h);
    S.composer?.setSize(w, h);
    S.ssao?.setSize(w, h);
    S.bloom?.setSize(w, h);
    S.outline?.setSize(w, h);
    S.labelRenderer.setSize(w, h);
}

export function updateBed(id, status) {
    if (!S) return;
    const mesh = S.built.bedMeshes.get(id);
    if (mesh) mesh.material.color.setHex(statusColor(status));
}

export function dispose() {
    if (!S) return;
    S.stop();
    S.ro?.disconnect();
    S.renderer.domElement.removeEventListener('pointermove', S.onMove);
    S.renderer.domElement.removeEventListener('pointerdown', S.onDown);
    S.renderer.domElement.removeEventListener('pointerup', S.onUp);
    S.controls.dispose();

    // CSS2D labels
    S.built.labels.forEach(o => { o.element?.remove?.(); o.parent?.remove(o); });
    if (S.labelRenderer.domElement.parentNode) S.labelRenderer.domElement.parentNode.removeChild(S.labelRenderer.domElement);

    // GL resources
    S.scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            (Array.isArray(obj.material) ? obj.material : [obj.material])
                .forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
        }
    });
    if (S.scene.background && S.scene.background.dispose) S.scene.background.dispose();
    S.envRT?.dispose?.();
    S.composer?.dispose?.();
    S.ssao?.dispose?.();
    S.bloom?.dispose?.();
    S.outline?.dispose?.();

    S.renderer.dispose();
    S.renderer.forceContextLoss();
    if (S.renderer.domElement.parentNode) S.renderer.domElement.parentNode.removeChild(S.renderer.domElement);
    S = null;
}
