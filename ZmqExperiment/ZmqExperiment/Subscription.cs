using ProtoBuf;

namespace ZmqExperiment;

[ProtoContract]
public class EventSubscription1
{
    public string event_type { get; set; }
    public ICollection<EventFilter> filters { get; set; }
}

[ProtoContract]
public class EventFilter1
{
    [ProtoMember(1)]
    public string key { get; set; }
    [ProtoMember(2)]
    public string match_string { get; set; }
    [ProtoMember(3)]
    public FilterType filter_type { get; set; }

    public enum FilterType
    {
        FILTER_TYPE_UNSET = 0,
        SIMPLE_ANY = 1,
        SIMPLE_ALL = 2,
        REGEX_ANY  = 3,
        REGEX_ALL  = 4
    }
}