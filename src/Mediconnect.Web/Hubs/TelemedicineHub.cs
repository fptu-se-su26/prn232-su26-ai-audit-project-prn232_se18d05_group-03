using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;

namespace Mediconnect.Web.Hubs;

// Thin signaling relay for WebRTC offer/answer/ICE exchange between the two Blazor Server
// circuits (doctor + patient) in the same telemedicine room. No [Authorize] — the room id
// (TelemedicineSession.Id) is an unguessable GUID and is the only access control needed for
// a relay that carries no PHI, only SDP/ICE payloads.
public class TelemedicineHub : Hub
{
    private static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _rooms = new();

    public async Task<int> JoinRoom(string roomId)
    {
        var room = _rooms.GetOrAdd(roomId, _ => new ConcurrentDictionary<string, byte>());
        var countBefore = room.Count;
        room[Context.ConnectionId] = 0;
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        return countBefore;
    }

    public async Task LeaveRoom(string roomId)
    {
        if (_rooms.TryGetValue(roomId, out var room))
        {
            room.TryRemove(Context.ConnectionId, out _);
        }
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
    }

    public async Task SendSignal(string roomId, string signal) =>
        await Clients.OthersInGroup(roomId).SendAsync("ReceiveSignal", signal);

    public async Task SendIceCandidate(string roomId, string candidate) =>
        await Clients.OthersInGroup(roomId).SendAsync("ReceiveIceCandidate", candidate);

    public async Task NotifyCallEnded(string roomId) =>
        await Clients.OthersInGroup(roomId).SendAsync("CallEnded");

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        foreach (var room in _rooms.Values)
        {
            room.TryRemove(Context.ConnectionId, out _);
        }
        return base.OnDisconnectedAsync(exception);
    }
}
