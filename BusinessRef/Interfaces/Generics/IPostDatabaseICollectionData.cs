using System.Collections.Generic;

namespace BusinessRef.Interfaces.Generics
{
    public interface IPostDatabaseICollectionData<T>
    {
        ICollection<T> PostDatabaseICollectionData();
    }
}
