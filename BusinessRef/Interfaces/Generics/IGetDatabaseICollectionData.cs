using System.Collections.Generic;

namespace BusinessRef.Interfaces.Generics
{
    public interface IGetDatabaseICollectionData<T>
    {
        ICollection<T> GetDatabaseICollectionData();
    }
}
