namespace CursorTest.API.Services
{
    public interface ICsvService
    {
        List<T> ReadCsv<T>(string fileName);
        void WriteCsv<T>(string fileName, IEnumerable<T> records);
    }
} 