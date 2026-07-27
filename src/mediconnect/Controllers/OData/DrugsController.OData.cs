using Mediconnect.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace Mediconnect.Api.Controllers;

public partial class DrugsController
{
    // OData: hỗ trợ $filter/$select/$orderby/$top/$skip/$count, được EF dịch xuống SQL.
    // Ví dụ: GET api/drugs/odata?$filter=StockQuantity gt 0&$orderby=UnitPrice desc&$top=5
    [HttpGet("odata")]
    [EnableQuery]
    public IQueryable<DrugReadDto> GetOData()
    {
        return _repository.Query().Select(d => new DrugReadDto
        {
            Id = d.Id,
            Name = d.Name,
            Code = d.Code,
            Unit = d.Unit,
            StockQuantity = d.StockQuantity,
            UnitPrice = d.UnitPrice,
            IsActive = d.IsActive,
            MaxDailyDose = d.MaxDailyDose,
            MaxDosePerKg = d.MaxDosePerKg
        });
    }
}
