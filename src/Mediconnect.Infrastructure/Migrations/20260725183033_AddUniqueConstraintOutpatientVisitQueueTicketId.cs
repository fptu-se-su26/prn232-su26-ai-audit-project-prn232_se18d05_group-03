using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mediconnect.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraintOutpatientVisitQueueTicketId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OutpatientVisits_QueueTicketId",
                table: "OutpatientVisits");

            migrationBuilder.CreateIndex(
                name: "IX_OutpatientVisits_QueueTicketId_Unique",
                table: "OutpatientVisits",
                column: "QueueTicketId",
                unique: true,
                filter: "[QueueTicketId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OutpatientVisits_QueueTicketId_Unique",
                table: "OutpatientVisits");

            migrationBuilder.CreateIndex(
                name: "IX_OutpatientVisits_QueueTicketId",
                table: "OutpatientVisits",
                column: "QueueTicketId");
        }
    }
}
