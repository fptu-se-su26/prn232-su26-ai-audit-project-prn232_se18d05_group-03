window.telemedicineInterop = {
    _localStream: null,
    _pc: null,
    _dotnetRef: null,
    _pendingCandidates: [],

    init: function (dotnetRef) {
        this._dotnetRef = dotnetRef;
        this._pendingCandidates = [];
    },

    startLocalVideo: async function (localVideoId) {
        this._localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const localEl = document.getElementById(localVideoId);
        if (localEl) {
            localEl.srcObject = this._localStream;
        }
    },

    createPeerConnection: function () {
        if (this._pc) {
            try { this._pc.close(); } catch (e) { }
            this._pc = null;
        }

        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' }
            ]
        };

        this._pc = new RTCPeerConnection(configuration);

        if (this._localStream) {
            this._localStream.getTracks().forEach(track => {
                this._pc.addTrack(track, this._localStream);
            });
        }

        this._pc.onicecandidate = e => {
            if (e.candidate && this._dotnetRef) {
                this._dotnetRef.invokeMethodAsync('OnIceCandidateReady', JSON.stringify(e.candidate));
            }
        };

        this._pc.ontrack = e => {
            const remote = document.getElementById('remoteVideo');
            if (remote) {
                if (e.streams && e.streams[0]) {
                    remote.srcObject = e.streams[0];
                } else {
                    if (!remote.srcObject) {
                        remote.srcObject = new MediaStream();
                    }
                    remote.srcObject.addTrack(e.track);
                }
                remote.play().catch(err => console.warn("Remote video play failed:", err));
            }
        };
    },

    createOffer: async function () {
        this.createPeerConnection();
        const offer = await this._pc.createOffer();
        await this._pc.setLocalDescription(offer);
        return JSON.stringify(offer);
    },

    handleOffer: async function (offerJson) {
        this.createPeerConnection();
        await this._pc.setRemoteDescription(JSON.parse(offerJson));
        await this._processPendingCandidates();
        const answer = await this._pc.createAnswer();
        await this._pc.setLocalDescription(answer);
        return JSON.stringify(answer);
    },

    handleAnswer: async function (answerJson) {
        if (!this._pc) return;
        await this._pc.setRemoteDescription(JSON.parse(answerJson));
        await this._processPendingCandidates();
    },

    addIceCandidate: async function (candidateJson) {
        const candidate = new RTCIceCandidate(JSON.parse(candidateJson));
        if (!this._pc || !this._pc.remoteDescription) {
            this._pendingCandidates.push(candidate);
            return;
        }
        try {
            await this._pc.addIceCandidate(candidate);
        } catch (e) {
            console.error("Error adding ice candidate:", e);
        }
    },

    _processPendingCandidates: async function () {
        while (this._pendingCandidates.length > 0) {
            const candidate = this._pendingCandidates.shift();
            try {
                await this._pc.addIceCandidate(candidate);
            } catch (e) {
                console.error("Error adding queued ice candidate:", e);
            }
        }
    },

    toggleAudio: function (enabled) {
        this._localStream?.getAudioTracks().forEach(t => t.enabled = enabled);
    },

    toggleVideo: function (enabled) {
        this._localStream?.getVideoTracks().forEach(t => t.enabled = enabled);
    },

    stopCall: function () {
        if (this._pc) {
            try { this._pc.close(); } catch (e) { }
            this._pc = null;
        }
        if (this._localStream) {
            try { this._localStream.getTracks().forEach(t => t.stop()); } catch (e) { }
            this._localStream = null;
        }
        this._pendingCandidates = [];
        const remote = document.getElementById('remoteVideo');
        if (remote) remote.srcObject = null;
        const local = document.getElementById('localVideo');
        if (local) local.srcObject = null;
    }
};
