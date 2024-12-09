CREATE DATABASE online_learning;
USE online_learning;

-- Bảng Users
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255),
    TeacherCheck ENUM('Yes', 'No') DEFAULT 'No'
);

-- Bảng Teachers
CREATE TABLE Teachers (
    TeacherID INT AUTO_INCREMENT PRIMARY KEY,
    AvailableSlots JSON
);

-- Bảng Lessons
CREATE TABLE Lessons (
    LessonID INT AUTO_INCREMENT PRIMARY KEY,
    TeacherID INT,
    StudentID INT,
    StartDate DATE,
    EndDate DATE,
    TimeStart INT,
    TimeEnd INT,
    FOREIGN KEY (TeacherID) REFERENCES Teachers(TeacherID),
    FOREIGN KEY (StudentID) REFERENCES Users(UserID)
);


INSERT INTO Teachers (AvailableSlots) VALUES
('["Monday 8:00-10:00", "Wednesday 10:00-12:00"]'),
('["Tuesday 14:00-16:00", "Thursday 8:00-10:00"]'),
('["Monday 14:00-16:00", "Wednesday 8:00-10:00"]'),
('["Friday 10:00-12:00", "Thursday 14:00-16:00"]'),
('["Monday 8:00-10:00", "Tuesday 10:00-12:00"]'),
('["Wednesday 14:00-16:00", "Friday 8:00-10:00"]'),
('["Tuesday 8:00-10:00", "Thursday 10:00-12:00"]'),
('["Monday 10:00-12:00", "Friday 14:00-16:00"]'),
('["Tuesday 14:00-16:00", "Thursday 14:00-16:00"]'),
('["Wednesday 8:00-10:00", "Friday 10:00-12:00"]');


INSERT INTO Users (Name, Email, Password, TeacherCheck) VALUES
('Tạ Thị Hậu', 'lolikun221@gmail.com', '22112003', 'No'),
('Đỗ Hoàng Anh', 'hoanganhpeas@gmail.com', '08062003', 'No'),
('Nguyễn Văn An', 'an.nguyen@example.com', 'password123', 'No'),
('Trần Văn Bình', 'binh.tran@example.com', 'password123', 'No'),
('Lê Thị Cúc', 'cuc.le@example.com', 'password123', 'No'),
('Hoàng Minh Châu', 'chau.hoang@example.com', 'password123', 'No'),
('Phạm Văn Dũng', 'dung.pham@example.com', 'password123', 'No'),
('Ngô Văn Đức', 'duc.ngo@example.com', 'password123', 'No'),
('Đặng Thị Hoa', 'hoa.dang@example.com', 'password123', 'No'),
('Nguyễn Hoàng Hải', 'hai.nguyen@example.com', 'password123', 'No'),
('Trần Văn Kiên', 'kien.tran@example.com', 'password123', 'No'),
('Võ Thị Lan', 'lan.vo@example.com', 'password123', 'No'),
('Lý Văn Long', 'long.ly@example.com', 'password123', 'No'),
('Đặng Văn Minh', 'minh.dang@example.com', 'password123', 'No'),
('Bùi Thị Nga', 'nga.bui@example.com', 'password123', 'No'),
('Phan Văn Phúc', 'phuc.phan@example.com', 'password123', 'No'),
('Nguyễn Văn Phương', 'phuong.nguyen@example.com', 'password123', 'No'),
('Trần Văn Sơn', 'son.tran@example.com', 'password123', 'No'),
('Vũ Văn Tùng', 'tung.vu@example.com', 'password123', 'No'),
('Hoàng Thị Tuyết', 'tuyet.hoang@example.com', 'password123', 'No');


-- Lịch chung cho (UserID 1) và (UserID 2)
INSERT INTO Lessons (TeacherID, StudentID, StartDate, EndDate, TimeStart, TimeEnd) VALUES
(1, 1, '2024-12-11', '2024-12-11', 800, 1000), -- Buổi 1
(1, 2, '2024-12-11', '2024-12-11', 800, 1000), -- Buổi 1

(3, 1, '2024-12-13', '2024-12-13', 1400, 1600), -- Buổi 2
(3, 2, '2024-12-13', '2024-12-13', 1400, 1600); -- Buổi 2

-- Học sinh UserID từ 3 đến 20
INSERT INTO Lessons (TeacherID, StudentID, StartDate, EndDate, TimeStart, TimeEnd) VALUES
-- UserID 3
(2, 3, '2024-12-12', '2024-12-12', 800, 1000),
(4, 3, '2024-12-14', '2024-12-14', 1000, 1200),

-- UserID 4
(3, 4, '2024-12-12', '2024-12-12', 1400, 1600),
(5, 4, '2024-12-15', '2024-12-15', 800, 1000),

-- UserID 5
(6, 5, '2024-12-11', '2024-12-11', 1000, 1200),
(7, 5, '2024-12-14', '2024-12-14', 1400, 1600),

-- UserID 6
(8, 6, '2024-12-13', '2024-12-13', 800, 1000),
(9, 6, '2024-12-15', '2024-12-15', 1000, 1200),

-- UserID 7
(2, 7, '2024-12-12', '2024-12-12', 800, 1000),
(4, 7, '2024-12-14', '2024-12-14', 1400, 1600),

-- Thêm các UserID còn lại tương tự
(3, 8, '2024-12-14', '2024-12-14', 800, 1000),
(5, 8, '2024-12-16', '2024-12-16', 1400, 1600),
(2, 9, '2024-12-12', '2024-12-12', 800, 1000),
(3, 9, '2024-12-15', '2024-12-15', 1400, 1600),

(6, 10, '2024-12-12', '2024-12-12', 1000, 1200),
(7, 10, '2024-12-16', '2024-12-16', 1400, 1600);
