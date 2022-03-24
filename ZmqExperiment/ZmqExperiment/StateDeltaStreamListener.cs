using System.Buffers;
using Google.Protobuf;
using ProtoBuf;
using Sawtooth.Sdk;
using Sawtooth.Sdk.Messaging;

namespace ZmqExperiment;

public class StateDeltaStreamListener : StreamListenerBase
{
    public StateDeltaStreamListener(string address) : base(address)
    {
    }

    public override void OnMessage(Message message)
    {
        // base.OnMessage(message);
        Console.WriteLine(message.ToString());
    }

    public async Task Start()
    {
        Connect();
        var newSub = new EventSubscription
        {
            EventType = "entity/create",
            Filters = { }
        };
        var newSubReq = new ClientEventsSubscribeRequest
        {
            LastKnownBlockIds = {  },
            Subscriptions = { newSub }
        };
        // {
        //     event_type = "sawtooth/state-delta",
        //     filters = new List<EventFilter>()
        // };
        // var buffer = new ArrayBufferWriter<byte>();
        // Serializer.Serialize(buffer, newSub);
        var byteArray = new byte[newSubReq.CalculateSize()];
        var stream = new CodedOutputStream(byteArray);
        newSubReq.WriteTo(stream);
        var msg = new Message();
        msg.MergeFrom(byteArray);
        // var msg = Message.Parser.ParseFrom(buffer.GetSpan().ToArray());
        // SendAsync(msg, CancellationToken.None);
        // Thread.Sleep(1000);
        Console.WriteLine("Attempting to send message!" + msg.ToByteString().ToByteArray().Length);
        // Message.Parser.ParseFrom(newSubReq.ToByteArray());
        await SendAsync(Message.Parser.ParseFrom(newSubReq.ToByteArray()), CancellationToken.None);
        Console.WriteLine("Attempting to send message2!");
    }
}