/* =============================================================================
   Mediconnect — Script tạo DỮ LIỆU DEMO phủ toàn bộ chức năng
   -----------------------------------------------------------------------------
   Mục đích: nạp dữ liệu mẫu (dịch vụ khám, thuốc, tương tác thuốc, lịch trực,
   lịch hẹn, hàng đợi, lượt khám + ICD-10, đơn thuốc, xét nghiệm, sinh tồn/y lệnh
   nội trú, hoá đơn + thanh toán, đánh giá, telemedicine) để demo các màn hình.

   Yêu cầu trước: DB đã chạy migration và đã có seed lõi của DbInitializer
   (Departments, Clinics, Beds, các tài khoản Admin/Doctor/Nurse/Lab/Patient...).
   Script tham chiếu nhân viên/bệnh nhân/phòng khám theo email & mã (Code) nên
   không phụ thuộc GUID cụ thể. Có guard: nếu đã có Appointments thì BỎ QUA
   (tránh tạo trùng khi chạy lại).

   Cách chạy:
     # Qua Docker container tên 'sqlserver':
     docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd \
       -S localhost -U sa -P '<mat_khau_sa>' -C -d NewMediconnect \
       < src/mediconnect/doc/seed_demo_data.sql

     # Hoặc bằng sqlcmd cài trực tiếp:
     sqlcmd -S localhost,1433 -U sa -P '<mat_khau_sa>' -C -d NewMediconnect \
       -i src/mediconnect/doc/seed_demo_data.sql

   Kịch bản demo tạo sẵn:
     - patient@  (Nguyễn Văn An): luồng đủ — khám→đơn thuốc→XN→hoá đơn ĐÃ thanh
       toán (BHYT 80%)→đánh giá 5★; kèm 2 ca nội trú có sinh tồn/y lệnh.
     - patient2@ (Trần Thị Bích): lịch hẹn sắp tới + vé chờ + phiên telemedicine.
     - patient3@ (Lê Minh Châu): khám xong nhưng hoá đơn CHƯA thanh toán (Pending).
     - CDSS: Warfarin/Aspirin/Ibuprofen (3 cặp kỵ nhau) + thuốc có ngưỡng liều;
       Cephalexin để tồn kho = 0 (test chặn kê khi hết hàng).
   ============================================================================= */

SET NOCOUNT ON;
SET XACT_ABORT ON;

-- Guard: chỉ chạy khi chưa có dữ liệu flow (tránh tạo trùng khi chạy lại)
IF EXISTS (SELECT 1 FROM Appointments)
BEGIN
    PRINT 'Da co du lieu Appointments -> BO QUA seed (tranh trung).';
    RETURN;
END;

BEGIN TRAN;

/* ===== Reference IDs (theo email/code, ben vung) ===== */
DECLARE @docGen uniqueidentifier = (SELECT sp.Id FROM StaffProfiles sp JOIN UserAccounts u ON sp.UserAccountId=u.Id WHERE u.Email='doctor@mediconnect.local');
DECLARE @docCard uniqueidentifier = (SELECT sp.Id FROM StaffProfiles sp JOIN UserAccounts u ON sp.UserAccountId=u.Id WHERE u.Email='doctor.card@mediconnect.local');
DECLARE @docPed uniqueidentifier = (SELECT sp.Id FROM StaffProfiles sp JOIN UserAccounts u ON sp.UserAccountId=u.Id WHERE u.Email='doctor.ped@mediconnect.local');
DECLARE @docSurg uniqueidentifier = (SELECT sp.Id FROM StaffProfiles sp JOIN UserAccounts u ON sp.UserAccountId=u.Id WHERE u.Email='doctor.surg@mediconnect.local');
DECLARE @nurse uniqueidentifier = (SELECT sp.Id FROM StaffProfiles sp JOIN UserAccounts u ON sp.UserAccountId=u.Id WHERE u.Email='nurse@mediconnect.local');

DECLARE @pAn uniqueidentifier  = (SELECT pp.Id FROM PatientProfiles pp JOIN UserAccounts u ON pp.UserAccountId=u.Id WHERE u.Email='patient@mediconnect.local');
DECLARE @pBich uniqueidentifier= (SELECT pp.Id FROM PatientProfiles pp JOIN UserAccounts u ON pp.UserAccountId=u.Id WHERE u.Email='patient2@mediconnect.local');
DECLARE @pChau uniqueidentifier= (SELECT pp.Id FROM PatientProfiles pp JOIN UserAccounts u ON pp.UserAccountId=u.Id WHERE u.Email='patient3@mediconnect.local');

DECLARE @clNoi  uniqueidentifier = (SELECT Id FROM Clinics WHERE RoomNumber='N-P01');
DECLARE @clTim  uniqueidentifier = (SELECT Id FROM Clinics WHERE RoomNumber='TM-P01');
DECLARE @clNhi  uniqueidentifier = (SELECT Id FROM Clinics WHERE RoomNumber='PD-P01');

DECLARE @deptGen uniqueidentifier = (SELECT Id FROM Departments WHERE Code='GEN');
DECLARE @deptCard uniqueidentifier= (SELECT Id FROM Departments WHERE Code='CARD');
DECLARE @deptPed uniqueidentifier = (SELECT Id FROM Departments WHERE Code='PED');

DECLARE @admER  uniqueidentifier = 'C25D3F3E-4550-4271-BA17-10D0A6E5DF60';
DECLARE @admGen uniqueidentifier = '04C55BB8-3AB3-43FC-82D0-1AB6BA5D7611';

DECLARE @now datetime2 = SYSUTCDATETIME();
DECLARE @today date = CAST(@now AS date);

/* ===== 1) MedicalServices (dich vu kham + gia) ===== */
INSERT INTO MedicalServices (Id,DepartmentId,Name,Code,Price,IsActive) VALUES
 (NEWID(),@deptGen ,N'Khám Nội tổng quát',N'KB-GEN',150000,1),
 (NEWID(),@deptCard,N'Khám Tim mạch',N'KB-CARD',250000,1),
 (NEWID(),@deptPed ,N'Khám Nhi',N'KB-PED',180000,1),
 (NEWID(),@deptGen ,N'Xét nghiệm công thức máu',N'XN-CBC',120000,1),
 (NEWID(),@deptCard,N'Điện tâm đồ (ECG)',N'CLS-ECG',200000,1),
 (NEWID(),@deptGen ,N'Chụp X-quang ngực',N'CLS-XRAY',300000,1);

DECLARE @svcExamGen uniqueidentifier = (SELECT Id FROM MedicalServices WHERE Code='KB-GEN');
DECLARE @svcExamPed uniqueidentifier = (SELECT Id FROM MedicalServices WHERE Code='KB-PED');

/* ===== 2) Drugs (kho thuoc + gia + nguong lieu) ===== */
DECLARE @dParacetamol uniqueidentifier=NEWID(), @dAmox uniqueidentifier=NEWID(), @dIbu uniqueidentifier=NEWID(),
        @dAspirin uniqueidentifier=NEWID(), @dWarfarin uniqueidentifier=NEWID(), @dOme uniqueidentifier=NEWID(),
        @dMetformin uniqueidentifier=NEWID(), @dAmlodipine uniqueidentifier=NEWID(), @dCephalexin uniqueidentifier=NEWID(),
        @dLoratadine uniqueidentifier=NEWID();
INSERT INTO Drugs (Id,Name,Code,Unit,StockQuantity,UnitPrice,IsActive,MaxDailyDose,MaxDosePerKg) VALUES
 (@dParacetamol,N'Paracetamol 500mg',N'PARA500',N'viên',500,1200,1,4000,60),
 (@dAmox,       N'Amoxicillin 500mg',N'AMOX500',N'viên',300,2500,1,3000,45),
 (@dIbu,        N'Ibuprofen 400mg',N'IBU400',N'viên',400,1500,1,3200,40),
 (@dAspirin,    N'Aspirin 81mg',N'ASP81',N'viên',600,800,1,325,NULL),
 (@dWarfarin,   N'Warfarin 5mg',N'WAR5',N'viên',150,5000,1,10,NULL),
 (@dOme,        N'Omeprazole 20mg',N'OME20',N'viên',350,3000,1,40,NULL),
 (@dMetformin,  N'Metformin 500mg',N'MET500',N'viên',450,1000,1,2000,NULL),
 (@dAmlodipine, N'Amlodipine 5mg',N'AML5',N'viên',300,1800,1,10,NULL),
 (@dCephalexin, N'Cephalexin 500mg',N'CEP500',N'viên',0,2800,1,4000,50),
 (@dLoratadine, N'Loratadine 10mg',N'LOR10',N'viên',250,2000,1,10,NULL);

/* ===== 3) DrugInteractions (cap ky nhau) ===== */
INSERT INTO DrugInteractions (Id,DrugId,InteractingDrugId,Severity,Description) VALUES
 (NEWID(),@dWarfarin,@dAspirin,N'Major',N'Tăng nguy cơ chảy máu nghiêm trọng khi dùng chung.'),
 (NEWID(),@dWarfarin,@dIbu,    N'Major',N'NSAID làm tăng tác dụng chống đông, nguy cơ xuất huyết.'),
 (NEWID(),@dAspirin, @dIbu,    N'Moderate',N'Ibuprofen làm giảm tác dụng bảo vệ tim mạch của Aspirin.');

/* ===== 4) StaffSchedules (lich truc tuan nay) ===== */
INSERT INTO StaffSchedules (Id,StaffId,ShiftDate,StartTime,EndTime,ShiftType,WorkRoom) VALUES
 (NEWID(),@docGen ,@today,'07:00','11:30',0,N'N-P01'),
 (NEWID(),@docGen ,DATEADD(day,1,@today),'13:00','17:00',1,N'N-P01'),
 (NEWID(),@docCard,@today,'07:00','11:30',0,N'TM-P01'),
 (NEWID(),@docPed ,@today,'13:00','17:00',1,N'PD-P01'),
 (NEWID(),@nurse  ,@today,'07:00','11:30',0,N'Khu Nội'),
 (NEWID(),@nurse  ,@today,'17:00','21:00',2,N'Khu Nội');

/* ===== 5) BENH NHAN AN: luong kham hoan chinh (dat lich -> kham -> don thuoc -> XN -> hoa don -> danh gia) ===== */
DECLARE @apptAn uniqueidentifier=NEWID(), @qAn uniqueidentifier=NEWID(), @visitAn uniqueidentifier=NEWID(),
        @presAn uniqueidentifier=NEWID(), @labAn uniqueidentifier=NEWID(), @invAn uniqueidentifier=NEWID(),
        @payAn uniqueidentifier=NEWID();

INSERT INTO Appointments (Id,PatientId,DoctorId,ClinicId,AppointmentTime,Status,Reason,Notes) VALUES
 (@apptAn,@pAn,@docGen,@clNoi,DATEADD(day,-1,@now),3,N'Ho, sốt nhẹ 2 ngày',NULL);

INSERT INTO QueueTickets (Id,ClinicId,AppointmentId,Number,IssuedAt,Status) VALUES
 (@qAn,@clNoi,@apptAn,1,DATEADD(day,-1,@now),3);

INSERT INTO OutpatientVisits (Id,PatientId,DoctorId,ClinicId,QueueTicketId,VisitDate,ChiefComplaint,DiagnosisCode,DiagnosisDescription,Status,Notes) VALUES
 (@visitAn,@pAn,@docGen,@clNoi,@qAn,DATEADD(day,-1,@now),N'Ho, sốt nhẹ',N'J06.9',N'Nhiễm khuẩn hô hấp trên cấp',2,N'Sốt 38 độ, họng đỏ. Kê kháng sinh + hạ sốt.');

INSERT INTO Prescriptions (Id,OutpatientVisitId,DoctorId,IssuedAt,Notes) VALUES
 (@presAn,@visitAn,@docGen,DATEADD(day,-1,@now),N'Uống sau ăn, tái khám nếu sốt cao');
INSERT INTO PrescriptionItems (Id,PrescriptionId,DrugId,Dose,Frequency,DurationDays,Quantity) VALUES
 (NEWID(),@presAn,@dParacetamol,N'500mg — Oral',N'3 lần/ngày',5,15),
 (NEWID(),@presAn,@dAmox,       N'500mg — Oral',N'2 lần/ngày',7,14);

INSERT INTO LabOrders (Id,OutpatientVisitId,OrderedById,TestName,Status,OrderedAt,Notes) VALUES
 (@labAn,@visitAn,@docGen,N'Công thức máu (CBC)',2,DATEADD(day,-1,@now),NULL);
INSERT INTO LabResults (Id,LabOrderId,ResultText,ResultFileUrl,ResultedAt) VALUES
 (NEWID(),@labAn,N'WBC 11.2 (tăng nhẹ), các chỉ số khác bình thường.',NULL,DATEADD(day,-1,@now));

INSERT INTO BillingInvoices (Id,PatientId,CreatedAt,Status,Subtotal,InsuranceDeduction,TotalAmount,InsuranceNumber) VALUES
 (@invAn,@pAn,DATEADD(day,-1,@now),2,323100,258480,64620,N'BHYT-0001'); -- exam 150k + CBC 120k + thuoc (15*1200+14*2500=53100) = 323100; BHYT 80%
INSERT INTO BillingItems (Id,BillingInvoiceId,ItemType,Description,Quantity,UnitPrice,Amount) VALUES
 (NEWID(),@invAn,0,N'Phí khám - Khám Nội tổng quát',1,150000,150000),
 (NEWID(),@invAn,1,N'Xét nghiệm - Công thức máu (CBC)',1,120000,120000),
 (NEWID(),@invAn,2,N'Thuốc - Paracetamol 500mg',15,1200,18000),
 (NEWID(),@invAn,2,N'Thuốc - Amoxicillin 500mg',14,2500,35000);
INSERT INTO Payments (Id,BillingInvoiceId,Method,Amount,PaidAt,Status,TransactionRef) VALUES
 (@payAn,@invAn,1,64620,DATEADD(day,-1,@now),1,N'VNP20260725ABC123');

INSERT INTO ServiceRatings (Id,PatientId,DoctorId,OutpatientVisitId,Score,Comment,CreatedAt) VALUES
 (NEWID(),@pAn,@docGen,@visitAn,5,N'Bác sĩ tận tình, giải thích rõ ràng.',DATEADD(day,-1,@now));

/* ===== 6) BENH NHAN BICH: lich sap toi + hang doi + telemedicine ===== */
DECLARE @apptBich uniqueidentifier=NEWID(), @teleBich uniqueidentifier=NEWID();
INSERT INTO Appointments (Id,PatientId,DoctorId,ClinicId,AppointmentTime,Status,Reason,Notes) VALUES
 (@apptBich,@pBich,@docCard,@clTim,DATEADD(day,1,@now),1,N'Đau ngực, kiểm tra tim mạch',NULL);
INSERT INTO QueueTickets (Id,ClinicId,AppointmentId,Number,IssuedAt,Status) VALUES
 (NEWID(),@clTim,NULL,1,@now,0); -- vang lai dang cho
DECLARE @apptTele uniqueidentifier=NEWID();
INSERT INTO Appointments (Id,PatientId,DoctorId,ClinicId,AppointmentTime,Status,Reason,Notes) VALUES
 (@apptTele,@pBich,@docCard,@clTim,DATEADD(hour,2,@now),1,N'Tư vấn từ xa - tái khám',NULL);
INSERT INTO TelemedicineSessions (Id,AppointmentId,DoctorId,PatientId,StartedAt,EndedAt,VideoCallUrl,Notes) VALUES
 (@teleBich,@apptTele,@docCard,@pBich,NULL,NULL,NULL,NULL);

/* ===== 7) BENH NHAN CHAU: kham xong nhung hoa don CHUA thanh toan (Pending) ===== */
DECLARE @apptChau uniqueidentifier=NEWID(), @visitChau uniqueidentifier=NEWID(),
        @presChau uniqueidentifier=NEWID(), @invChau uniqueidentifier=NEWID();
INSERT INTO Appointments (Id,PatientId,DoctorId,ClinicId,AppointmentTime,Status,Reason,Notes) VALUES
 (@apptChau,@pChau,@docPed,@clNhi,@now,0,N'Khám sức khỏe định kỳ',NULL);
INSERT INTO OutpatientVisits (Id,PatientId,DoctorId,ClinicId,QueueTicketId,VisitDate,ChiefComplaint,DiagnosisCode,DiagnosisDescription,Status,Notes) VALUES
 (@visitChau,@pChau,@docPed,@clNhi,NULL,DATEADD(hour,-3,@now),N'Sổ mũi, hắt hơi',N'J30.9',N'Viêm mũi dị ứng',2,N'Kê thuốc kháng histamin.');
INSERT INTO Prescriptions (Id,OutpatientVisitId,DoctorId,IssuedAt,Notes) VALUES
 (@presChau,@visitChau,@docPed,DATEADD(hour,-3,@now),NULL);
INSERT INTO PrescriptionItems (Id,PrescriptionId,DrugId,Dose,Frequency,DurationDays,Quantity) VALUES
 (NEWID(),@presChau,@dLoratadine,N'10mg — Oral',N'1 lần/ngày',7,7);
INSERT INTO BillingInvoices (Id,PatientId,CreatedAt,Status,Subtotal,InsuranceDeduction,TotalAmount,InsuranceNumber) VALUES
 (@invChau,@pChau,DATEADD(hour,-3,@now),1,194000,155200,38800,N'BHYT-0003'); -- exam 180k + thuoc 7*2000=14000
INSERT INTO BillingItems (Id,BillingInvoiceId,ItemType,Description,Quantity,UnitPrice,Amount) VALUES
 (NEWID(),@invChau,0,N'Phí khám - Khám Nhi',1,180000,180000),
 (NEWID(),@invChau,2,N'Thuốc - Loratadine 10mg',7,2000,14000);

/* ===== 8) NOI TRU: sinh ton + y lenh cho 2 ca dang nam cua benh nhan An ===== */
INSERT INTO VitalSigns (Id,AdmissionId,RecordedAt,Pulse,TemperatureC,BloodPressureSystolic,BloodPressureDiastolic,RespiratoryRate,SpO2) VALUES
 (NEWID(),@admGen,DATEADD(hour,-6,@now),82,37.2,120,80,18,98),
 (NEWID(),@admGen,DATEADD(hour,-2,@now),88,37.8,125,82,20,97),
 (NEWID(),@admER ,DATEADD(hour,-4,@now),95,38.5,130,85,22,95);
INSERT INTO CareOrders (Id,AdmissionId,OrderedById,OrderType,Description,OrderedAt,IsCompleted,CompletedAt) VALUES
 (NEWID(),@admGen,@docGen,0,N'Paracetamol 500mg uống khi sốt >38.5',DATEADD(hour,-6,@now),1,DATEADD(hour,-2,@now)),
 (NEWID(),@admGen,@docGen,1,N'Truyền dịch NaCl 0.9% 500ml',DATEADD(hour,-5,@now),0,NULL),
 (NEWID(),@admGen,@docGen,2,N'Chế độ ăn cháo loãng',DATEADD(hour,-5,@now),0,NULL),
 (NEWID(),@admER ,@docSurg,3,N'Theo dõi sát dấu hiệu sinh tồn mỗi 2 giờ',DATEADD(hour,-4,@now),0,NULL);

COMMIT;
PRINT '=== SEED HOAN TAT ===';
