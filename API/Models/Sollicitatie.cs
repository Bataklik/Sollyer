namespace API.Models;

public class Sollicitatie {
    private string? _link;
    public int Id { get; set; }
    public int BedrijfInfoId { get; set; }
    public BedrijfInfo BedrijfInfo { get; set; } = null;
    public DateTime Datum { get; set; }
    public SollicitatieStatus Status { get; set; }
    public string? Link {
        get => _link;
        set => SetLink(value);
    }
    public string Notities { get; set; } = string.Empty;

    public Sollicitatie(BedrijfInfo bedrijfInfo, DateTime datum, SollicitatieStatus status, string link,
        string notities) {
        BedrijfInfo = bedrijfInfo;
        Datum = datum;
        Status = status;
        Link = link;
        Notities = notities;
    }

    public Sollicitatie() { }

    private void SetLink(string? link) {
        if (string.IsNullOrEmpty(link)) {
            _link = null;
            return;
        }
        if (!Uri.TryCreate(link, UriKind.Absolute, out Uri? uri) || 
            uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps) 
            throw new ArgumentException("Ongeldige URL, moet http of https zijn.", nameof(link));
        _link = link;
    }
}