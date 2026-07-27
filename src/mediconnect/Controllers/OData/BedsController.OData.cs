using Mediconnect.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace Mediconnect.Api.Controllers;

public partial class BedsController
{
    // OData: GET api/beds/odata?$filter=Status eq 'Available'&$orderby=Floor
    [HttpGet("odata")]
    [EnableQuery]
    public IQueryable<BedReadDto> GetOData()
    {
        return _repository.Query().Select(b => new BedReadDto
        {
            Id = b.Id,
            DepartmentId = b.DepartmentId,
            Ward = b.Ward,
            RoomNumber = b.RoomNumber,
            BedNumber = b.BedNumber,
            Status = b.Status,
            Floor = b.Floor,
            PositionX = b.PositionX,
            PositionY = b.PositionY
        });
    }
}
