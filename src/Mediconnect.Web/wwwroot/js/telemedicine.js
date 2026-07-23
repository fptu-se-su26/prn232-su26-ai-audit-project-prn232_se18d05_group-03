window.telemedicineInterop = {
    _localStream: null,
    _pc: null,
    _dotnetRef: null,

    init: function (dotnetRef) {
        this._dotnetRef = dotnetRef;
    },

    startLocalVideo: async function (localVideoId) {
        this._localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById(localVideoId).srcObject = this._localStream;
    },

    createPeerConnection: function () {
        // KNOWN LIMITATION: cross-NAT calls require a TURN server; out of scope for this build.
        this._pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        this._localStream.getTracks().forEach(t => this._pc.addTrack(t, this._localStream));
        this._pc.onicecandidate = e => {
            if (e.candidate) this._dotnetRef.invokeMethodAsync('OnIceCandidateReady', JSON.stringify(e.candidate));
        };
        this._pc.ontrack = e => {
            const remote = document.getElementById('remoteVideo');
            if (remote) remote.srcObject = e.streams[0];
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
        const answer = await this._pc.createAnswer();
        await this._pc.setLocalDescription(answer);
        return JSON.stringify(answer);
    },

    handleAnswer: async function (answerJson) {
        await this._pc.setRemoteDescription(JSON.parse(answerJson));
    },

    addIceCandidate: async function (candidateJson) {
        if (!this._pc) return;
        await this._pc.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateJson)));
    },

    toggleAudio: function (enabled) {
        this._localStream?.getAudioTracks().forEach(t => t.enabled = enabled);
    },

    toggleVideo: function (enabled) {
        this._localStream?.getVideoTracks().forEach(t => t.enabled = enabled);
    },

    stopCall: function () {
        this._pc?.close();
        this._localStream?.getTracks().forEach(t => t.stop());
        this._pc = null;
        this._localStream = null;
    }
};
