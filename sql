CREATE DATABASE online_learning;
USE online_learning;

-- Các bảng
-- Bảng Users
CREATE TABLE Users(
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255),
    TeacherCheck ENUM('Yes', 'No') DEFAULT 'No'
);
-- Bảng Teachers
CREATE TABLE Teachers(
    TeacherID INT AUTO_INCREMENT PRIMARY KEY,
    TeacherName VARCHAR(100),
    UserID INT,
    AvailableSlots JSON,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
-- Bảng Students
CREATE TABLE Students(
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentCode VARCHAR(30),
    UserID INT,
    StudentName VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
-- Bảng Subjects 
CREATE TABLE Subjects(
	SubjectID INT AUTO_INCREMENT PRIMARY KEY,
    SubjectCode VARCHAR(50),
    TeacherID INT,
    SubjectName VARCHAR(100),
    SubjectGroup VARCHAR(100),
    Major VARCHAR(100),
    WeekDay INT,
    StatDate DATE,
    EndDate DATE,
    Link VARCHAR(255),
    FOREIGN KEY (TeacherID) REFERENCES Teachers(TeacherID)
);
-- Bảng Lessons
CREATE TABLE Lessons(
    LessonID INT AUTO_INCREMENT PRIMARY KEY,
    TeacherID INT,
    StudentID INT,
    SubjectID INT,
    WeekDay INT,
    TimeStart INT,
    TimeEnd INT,
    FOREIGN KEY (TeacherID) REFERENCES Teachers(TeacherID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (SubjectID) REFERENCES Subjects(SubjectID)
);

-- Thêm dữ liệu
-- Dữ liệu bảng Users 
INSERT INTO Users(Email, Password, TeacherCheck) VALUES
('lolikun221@gmail.com', '22012003', 'No'),
('hoanganhpeas@gmail.com', '08062003', 'No'),
('an.nguyen@example.com', 'password123', 'No'),
('binh.tran@example.com', 'password123', 'No'),
('cuc.le@example.com', 'password123', 'No'),
('chau.hoang@example.com', 'password123', 'No'),
('dung.pham@example.com', 'password123', 'No'),
('duc.ngo@example.com', 'password123', 'No'),
('hoa.dang@example.com', 'password123', 'No'),
('hai.nguyen@example.com', 'password123', 'No'),
('kien.tran@example.com', 'password123', 'No'),
('lan.vo@example.com', 'password123', 'No'),
('long.ly@example.com', 'password123', 'No'),
('minh.dang@example.com', 'password123', 'No'),
('nga.bui@example.com', 'password123', 'No'),
('phuc.phan@example.com', 'password123', 'No'),
('phuong.nguyen@example.com', 'password123', 'No'),
('son.tran@example.com', 'password123', 'No'),
('tung.vu@example.com', 'password123', 'No'),
('tuyet.hoang@example.com', 'password123', 'No'),
('tu.ly@example.com', 'password123', 'Yes'),
('thao.nguyen@example.com', 'password123', 'Yes'),
('chi.nguyen@example.com', 'password123', 'Yes'),
('hoang.vo@example.com', 'password123', 'Yes'),
('hanh.nguyen@example.com', 'password123', 'Yes'),
('tuan.nguyen@example.com', 'password123', 'Yes'),
('tuan.tran@example.com', 'password123', 'Yes'),
('khoi.pham@example.com', 'password123', 'Yes'),
('hoai.vu@example.com', 'password123', 'Yes'),
('duyen.le@example.com', 'password123', 'Yes');
-- Dữ liệu bảng Teachers
INSERT INTO Teachers(TeacherName, UserID, AvailableSlots) VALUES
('Lý Tuấn Tú', 21, '["Monday 8:00-10:00", "Wednesday 10:00-12:00"]'),
('Nguyễn Hương Thảo', 22,  '["Tuesday 14:00-16:00", "Thursday 8:00-10:00"]'),
('Nguyễn Phương Chi', 23, '["Monday 14:00-16:00", "Wednesday 8:00-10:00"]'),
('Võ Tuấn Hoàng', 24, '["Friday 10:00-12:00", "Thursday 14:00-16:00"]'),
('Nguyễn Hồng Hạnh', 25, '["Monday 8:00-10:00", "Tuesday 10:00-12:00"]'),
('Nguyễn Huy Tuấn', 26, '["Wednesday 14:00-16:00", "Friday 8:00-10:00"]'),
('Trần Mạnh Tuấn', 27, '["Tuesday 8:00-10:00", "Thursday 10:00-12:00"]'),
('Phạm Hữu Khôi', 28, '["Monday 10:00-12:00", "Friday 14:00-16:00"]'),
('Vũ Quốc Hoài', 29, '["Tuesday 14:00-16:00", "Thursday 14:00-16:00"]'),
('Lê Bích Duyên', 30, '["Wednesday 8:00-10:00", "Friday 10:00-12:00"]');
-- Dữ liệu bảng Students
INSERT INTO Students(StudentCode, UserID, StudentName) VALUES
('2155010089', 1, 'Tạ Thị Hậu'),
('2155010004', 2, 'Đỗ Hoàng Anh'),
('2255010948', 3, 'Nguyễn Văn An'),
('2255010715', 4, 'Trần Văn Bình'),
('2155010986', 5, 'Lê Thị Cúc'),
('2155010141', 6, 'Hoàng Minh Châu'),
('2255010034', 7, 'Phạm Văn Dũng'),
('2255010591', 8, 'Ngô Văn Đức'),
('2055010015', 9, 'Đặng Thị Hoa'),
('2255010410', 10, 'Nguyễn Hoàng Hải'),
('2255010961', 11, 'Trần Văn Kiên'),
('2255010231', 12, 'Võ Thị Lan'),
('2055010788', 13, 'Lý Văn Long'),
('2055010486', 14, 'Đặng Văn Minh'),
('2155010327', 15, 'Bùi Thị Nga'),
('2255010269', 16, 'Phan Văn Phúc'),
('2055010589', 17, 'Nguyễn Văn Phương'),
('2055010027', 18, 'Trần Văn Sơn'),
('2155010213', 19, 'Vũ Văn Tùng'),
('2155010770', 20, 'Hoàng Thị Tuyết');
-- Dữ liệu bảng Subjects
INSERT INTO Subjects(SubjectCode, TeacherID, SubjectName, SubjectGroup, Major, WeekDay, StatDate, EndDate, Link) VALUES
('TH4309', 3, 'Công nghệ Web', 'KH máy tính & Công nghệ PM', 'CNTT', 3, '2024-09-02', '2024-10-13', ''),
('TH4309', 3, 'Công nghệ Web', 'KH máy tính & Công nghệ PM', 'CNTT', 6, '2024-09-02', '2024-10-13', ''),
('TH5216', 1, 'Đồ họa và hiện thực ảo', 'Mạng MT và các HTTT', 'CNTT', 2, '2024-09-02', '2024-10-13', ''),
('TH5216', 1, 'Đồ họa và hiện thực ảo', 'Mạng MT và các HTTT', 'CNTT', 5, '2024-09-02', '2024-10-13', ''),
('TH5213', 4, 'Lập trình mạng', 'Mạng MT và các HTTT', 'CNTT', 2, '2024-11-11', '2024-12-08', ''),
('TH5213', 4, 'Lập trình mạng', 'Mạng MT và các HTTT', 'CNTT', 5, '2024-11-11', '2025-01-05', ''),
('TH4318', 6, 'Phát triển phần mềm hướng dịch vụ', 'KH máy tính & Công nghệ PM', 'CNTT', 4, '2024-11-11', '2025-01-05', ''),
('TH4318', 6, 'Phát triển phần mềm hướng dịch vụ', 'KH máy tính & Công nghệ PM', 'CNTT', 7, '2024-12-09', '2025-01-05', ''),
('TH4314.1', 9, 'Quản lý dự án Công nghệ thông tin', 'KH máy tính & Công nghệ PM', 'CNTT', 3, '2025-02-03', '2025-03-30', ''),
('TH4314.1', 9, 'Quản lý dự án Công nghệ thông tin', 'KH máy tính & Công nghệ PM', 'CNTT', 6, '2025-03-03', '2025-03-30', ''),
('TH4308', 2, 'Kiểm thử và đảm bảo chất lượng phần mềm', 'KH máy tính & Công nghệ PM', 'CNTT', 7, '2025-02-03', '2025-03-30', ''),
('TH4308', 2, 'Kiểm thử và đảm bảo chất lượng phần mềm', 'KH máy tính & Công nghệ PM', 'CNTT', 4, '2025-03-17', '2025-03-30', ''),
('TH4311', 5, 'Phát triển ứng dụng cho các thiết bị di động', 'KH máy tính & Công nghệ PM', 'CNTT', 4, '2025-04-14', '2025-06-08', ''),
('TH4311', 5, 'Phát triển ứng dụng cho các thiết bị di động', 'KH máy tính & Công nghệ PM', 'CNTT', 7, '2025-05-12', '2025-06-08', '');

-- Dữ liệu cho thời khóa biểu
-- Lịch thứ hai
INSERT INTO Lessons(TeacherID, StudentID, SubjectID, WeekDay, TimeStart, TimeEnd) VALUES
(1, 1, 3, 2, 800, 1000), 
(1, 2, 3, 2,  800, 1000),
(1, 3, 3, 2,  800, 1000),
(1, 4, 3, 2,  800, 1000),
(1, 5, 3, 2,  800, 1000),   

(4, 1, 5, 2, 1400, 1600), 
(4, 2, 5, 2, 1400, 1600); 

-- Lịch thứ ba
INSERT INTO Lessons(TeacherID, StudentID, SubjectID, WeekDay, TimeStart, TimeEnd) VALUES
(3, 1, 1, 3, 800, 1000), 
(3, 2, 1, 3,  800, 1000),
(3, 8, 1, 3, 800, 1000), 
(3, 4, 1, 3,  800, 1000),

(9, 1, 9, 3, 1400, 1600), 
(9, 2, 9, 3, 1400, 1600); 

-- Lịch thứ tư
-- INSERT INTO Lessons(TeacherID, StudentID, SubjectID, WeekDay, TimeStart, TimeEnd) VALUES
-- (6, 1, 7, 4, 800, 1000), 
-- (6, 2, 7, 4,  800, 1000);


-- Lịch thứ năm
INSERT INTO Lessons(TeacherID, StudentID, SubjectID, WeekDay, TimeStart, TimeEnd) VALUES
(1, 1, 4, 5, 800, 1000), 
(1, 2, 4, 5,  800, 1000),
(1, 3, 4, 5, 800, 1000), 
(1, 4, 4, 5, 800, 1000), 
(1, 5, 4, 5,  800, 1000),

(4, 1, 6, 5, 1400, 1600), 
(4, 2, 6, 5, 1400, 1600); 

-- Lịch thứ sáu
INSERT INTO Lessons(TeacherID, StudentID, SubjectID, WeekDay, TimeStart, TimeEnd) VALUES
(3, 1, 2, 6, 800, 1000), 
(3, 2, 2, 6,  800, 1000),
(3, 8, 2, 6, 800, 1000), 
(3, 4, 2, 6,  800, 1000),

(9, 1, 10, 6, 1400, 1600), 
(9, 2, 10, 6, 1400, 1600); 

-- Lịch thứ bảy
-- INSERT INTO Lessons(TeacherID, StudentID, SubjectID, WeekDay, TimeStart, TimeEnd) VALUES
-- (6, 1, 8, 7, 800, 1000), 
-- (6, 2, 8, 7,  800, 1000),