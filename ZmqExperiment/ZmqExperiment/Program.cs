// See https://aka.ms/new-console-template for more information

using NetMQ;
using NetMQ.Sockets;
using ZmqExperiment;

Console.WriteLine("Hello, World!");

var listener = new StateDeltaStreamListener("tcp://localhost:4004");
await listener.Start();

Console.WriteLine("Starting response socket!");
using (var responder = new ResponseSocket())
{
    responder.Bind("tcp://localhost:4004");
    while (true)
    {
        string str = responder.ReceiveFrameString();
        Console.WriteLine("Received Hello");
        Console.WriteLine(str);
    }
}

Console.ReadLine();

