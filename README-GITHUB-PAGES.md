# Deploy mediconect-frontend to GitHub Pages

This README shows a minimal workflow to publish the static `mediconect-frontend` folder to GitHub Pages.

## 1) Prepare your repo
- Create a GitHub repository (e.g. `fptu-se-su26/prn232-su26-ai-audit-project-prn232_se18d05_group-03`).

## 2) Add & commit code locally

```bash
cd c:/Users/gia huy/Documents/duan/mediconect-frontend
git init
git add .
git commit -m "Initial static frontend for SmartCare"
git remote add origin https://github.com/fptu-se-su26/prn232-su26-ai-audit-project-prn232_se18d05_group-03.git
git branch -M main
git push -u origin main
```

## 3) Enable GitHub Pages (two options)

Option A — Publish from `main` branch (root):
- On GitHub, go to `Settings` -> `Pages` -> `Build and deployment` -> `Source`.
- Choose `Deploy from a branch` → select `main` and folder `/ (root)` → Save.

Option B — Publish from `gh-pages` branch (recommended when you want a build step):
- Locally create branch and push:

```bash
git checkout -b gh-pages
git push -u origin gh-pages
```

- On GitHub, set Pages source to `gh-pages` branch.

Option C — Use `gh` CLI to deploy quickly:

```bash
gh auth login
gh repo create YOUR_USERNAME/mediconect-frontend --public --source=. --remote=origin
gh pages deploy --branch=gh-pages --path=.
```

## 4) Ensure asset paths work
- Pages will serve files relative to the repository root. The created JS lives in `assets/js/` and is referenced with relative paths in HTML.
- If you publish to a repository page (username.github.io/REPO), and you host under a subpath, ensure links that assume root (`/assets/...`) are relative (they already are: `assets/js/...`).

## 4.1) Navigate to pages on GitHub Pages
After GitHub Pages is enabled, your site base URL will be:

```
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/
```

Open any page by appending the HTML filename to the base URL. Examples:

```
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/index.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/patient_dashboard.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/clinic_dashboard_queue_management.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/outpatient_emr_screen.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/e_prescription_interface.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/telemedicine_consultation.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/lab_imaging_results_entry.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/inpatient_ward_visual_map.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/ward_map_bed_quick_view_drawer.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/nursing_care_plan_vitals_charting.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/discharge_management_portal.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/hospital_analytics_reports.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/security_access_control_rbac.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/cdss_ai_medical_alerts.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/hr_shift_scheduling_matrix.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/appointment_booking_wizard.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/billing_insurance_integration.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/phr_vault_medical_timeline.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/phr_lab_result_detailed_view.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/emr_historical_records_slide_over.html
https://fptu-se-su26.github.io/prn232-su26-ai-audit-project-prn232_se18d05_group-03/view_record.html
```

## 5) Local check
- Open `index.html` in a browser for quick local checks (some features needing fetch() or CORS won't work locally when opened as file://; use a simple static server):

```bash
# python 3
python -m http.server 8000
# then open http://localhost:8000
```

## 6) What I added
- `assets/js/mock-data.js`: provides `window.MockAPI` with Promise-based mock data.
- `assets/js/app.js`: small helpers to inject mock patients/appointments and demo record view.
- Example usage: include the scripts before `</body>` on pages where you want demo data:

```html
<script src="assets/js/mock-data.js"></script>
<script src="assets/js/app.js"></script>
```

### Mock data hooks
Add `data-mock` on containers to auto-render demo content:
- `data-mock="appointments"`
- `data-mock="patients"`
- `data-mock="queue"` (use on `tbody` to render rows)
- `data-mock="lab-orders"`
- `data-mock="kpis"`

Example:

```html
<div class="divide-y" data-mock="appointments"></div>
```

## 7) Next steps / optional
- Replace mock data with real API endpoints when available.
- Add a build step (Vite/Parcel) if you want bundling and minification before deploy.
- Use `gh-pages` npm package or `gh` CLI for automated deploys in CI.

If you want, I can also:
- Insert the `<script>` tags into more HTML files automatically.
- Add a small `docs/` variant if you prefer to publish from the `docs` folder.
