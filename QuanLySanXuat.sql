﻿GO
	USE MASTER
GO
	DROP DATABASE QUANLYSANXUAT
GO
	CREATE DATABASE QUANLYSANXUAT
GO
	USE QUANLYSANXUAT
GO
	CREATE TABLE TAIKHOAN(
		ID INT IDENTITY PRIMARY KEY,
		TENDN NVARCHAR(MAX),
		MATKHAU NVARCHAR(MAX),
		NGUOIDUNGID INT
	)
GO
	CREATE TABLE NGUOIDUNG(
		ID INT IDENTITY PRIMARY KEY,
		HOTEN NVARCHAR(MAX),
		GIOITINH INT, -- 0 : NỮ, 1: NAM
		NGAYSINH DATETIME,
		QUEQUAN NVARCHAR(MAX),
		EMAIL NVARCHAR(MAX),
		SDT NVARCHAR(MAX),
		CHUCVU NVARCHAR(MAX),
		LOAI INT, -- 0: NHÂN VIÊN, 1: QUẢN LÝ, 2: KHACH HANG
	)
GO
	CREATE TABLE SANPHAM(
		ID INT IDENTITY PRIMARY KEY,
		TEN NVARCHAR(MAX),
		DONVITINH NVARCHAR(MAX),
		GIABAN INT, -- ĐƠN VỊ VNĐ
		HANSUDUNG INT, -- NGÀY
		GHICHU NVARCHAR(MAX),
		SOLUONG INT
	)
GO
	CREATE TABLE NGUYENLIEU(
		ID INT IDENTITY PRIMARY KEY,
		TEN NVARCHAR(MAX),
		DONVITINH NVARCHAR(MAX),
		GHICHU NVARCHAR(MAX),
		SOLUONG INT
	)
GO
	CREATE TABLE NGUYENLIEUSANXUAT(
		ID INT IDENTITY PRIMARY KEY,
		SANPHAMID INT,
			FOREIGN KEY (SANPHAMID) REFERENCES SANPHAM(ID),
		NGUYENLIEUID INT,
			FOREIGN KEY (NGUYENLIEUID) REFERENCES NGUYENLIEU(ID),
		SOLUONG INT
	)
GO
	CREATE TABLE PHIEUNHAP(
		ID INT IDENTITY PRIMARY KEY,
		NGAY DATETIME,
		NHANVIENID INT,
			FOREIGN KEY (NHANVIENID) REFERENCES NHANVIEN(ID),
		TONGTIEN INT
	)
GO
	CREATE TABLE CHITIETPHIEUNHAP(
		ID INT IDENTITY PRIMARY KEY,
		PHIEUNHAPID INT,
			FOREIGN KEY (PHIEUNHAPID) REFERENCES PHIEUNHAP(ID),
		NGUYENLIEUID INT,
			FOREIGN KEY (NGUYENLIEUID) REFERENCES NGUYENLIEU(ID),
		SOLUONG INT,
		DONGIA INT,
		THANHTIEN INT
	)
GO
	CREATE TABLE DONHANG(
		ID INT IDENTITY PRIMARY KEY,
		DOITACID INT,
			FOREIGN KEY (DOITACID) REFERENCES DOITAC(ID),
		NGAY DATETIME,
		NHANVIENID INT,
			FOREIGN KEY (NHANVIENID) REFERENCES NHANVIEN(ID),
		TONGTIEN INT, -- TỔNG TIỀN ĐÃ NHẬN
		DATCOC INT, -- TIỀN ĐẶT CỌC
		TRANGTHAI INT, -- 0: CHƯA NHẬN, 1: ĐÃ NHẬN, 2: ĐANG LÀM, 3: ĐÃ BÀN GIAO
		PHANTRAM INT, -- PHẦN TRĂM HOÀN THÀNH
		TRANGTHAINGUYENLIEU INT, -- 0: CHƯA ĐỦ NGUYÊN LIỆU, ĐÃ ĐỦ NGUYÊN LIỆU
	)
GO
	-- ĐỂ RIÊNG NGUYÊN LIỆU THEO ĐƠN HÀNG
	CREATE TABLE NGUYENLIEUDONHANG(
		ID INT IDENTITY PRIMARY KEY,
		DONGHANGID INT,
			FOREIGN KEY (DONHANGID) REFERENCES DONHANG(ID),
		NGUYENLIEUID INT,
			FOREIGN KEY (NGUYENLIEUID) REFERENCES NGUYENLIEU(ID),
		SOLUONG INT
	)
GO
	CREATE TABLE CHITIETDONHANG(
		ID INT IDENTITY PRIMARY KEY,
		DONHANGID INT,
			FOREIGN KEY (DONHANGID) REFERENCES DONHANG(ID),
		SANPHAMID INT,
			FOREIGN KEY (SANPHAMID) REFERENCES SANPHAM(ID),
		SOLUONG INT,
		DONGIA INT,
		THANHTIEN INT
	)
GO
	-- TIẾN ĐỘ SẢN XUẤT THEO ĐƠN HÀNG
	CREATE TABLE TIENDOSANXUAT(
		ID INT IDENTITY PRIMARY KEY,
		DONHANGID INT,
			FOREIGN KEY (DONHANGID) REFERENCES DONHANG(ID),
		NGAY DATETIME,
		SOLUONG INT,
		GHICHU NVARCHAR(MAX),
		NHANVIENID INT, -- Quản lý xác nhận
			FOREIGN KEY (NHANVIENID) REFERENCES NHANVIEN(ID)
	)
GO
