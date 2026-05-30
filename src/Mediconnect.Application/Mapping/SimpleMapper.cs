using System.Reflection;

namespace Mediconnect.Application.Mapping;

public static class SimpleMapper
{
    public static TDestination Map<TSource, TDestination>(TSource source)
        where TDestination : new()
    {
        var destination = new TDestination();
        MapTo(source, destination);
        return destination;
    }

    public static void MapTo<TSource, TDestination>(
        TSource source,
        TDestination destination,
        params string[] excludedProperties)
    {
        var excluded = new HashSet<string>(excludedProperties ?? Array.Empty<string>(), StringComparer.OrdinalIgnoreCase);
        var sourceProps = typeof(TSource).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var destinationProps = typeof(TDestination).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var destinationLookup = destinationProps.ToDictionary(p => p.Name, StringComparer.OrdinalIgnoreCase);

        foreach (var sourceProp in sourceProps)
        {
            if (!sourceProp.CanRead || excluded.Contains(sourceProp.Name))
            {
                continue;
            }

            if (!destinationLookup.TryGetValue(sourceProp.Name, out var destinationProp))
            {
                continue;
            }

            if (!destinationProp.CanWrite)
            {
                continue;
            }

            if (!destinationProp.PropertyType.IsAssignableFrom(sourceProp.PropertyType))
            {
                continue;
            }

            var value = sourceProp.GetValue(source);
            destinationProp.SetValue(destination, value);
        }
    }
}
