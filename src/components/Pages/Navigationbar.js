// import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
// import { Menu } from 'antd';
// import React, {useState} from 'react';
// import {HiAcademicCap } from "react-icons/hi";
// import {TbTemplate} from "react-icons/tb";
// import {SiReasonstudios} from "react-icons/si";
// import {MdOutlineInventory} from "react-icons/md";
// import {FaBars} from 'react-icons/fa';


// function getItem(label, key, icon, children, type) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   };
// }
// const items = [
//   getItem('Academic Module', 'sub1', <HiAcademicCap />, [
//     getItem('Timetable Creation' ),getItem('Timetable view' ), getItem('Student Attendance Reports', ),
//     getItem('Proctorial Master', 'g1', null, [getItem('Proctorial Action', '1'), getItem('Direct Demand Creation', '2'),], ''),
//   ]),

//   getItem('Institute Module', 'Sub2', <AppstoreOutlined />, [
//     getItem('Buiding Master Report','g1' ),getItem('Loan Scheme - AUID', ), getItem('Departmental Activity', ),getItem('  ', ),  
//   ]),
//   getItem('Employee Module', 'Sub3', <TbTemplate />, [
//     getItem('Accounts Menu', 'g1', null, [getItem('Payment Voucher', '1'), getItem('Direct Demand Creation', '2'),], ''),
//     getItem('Admin - Staff', 'g2', null, [getItem('New Joinee Approver', '1'), getItem('Consultant Approver', '2'),], ''),
//     getItem('Admin Reports', 'g3', null, [getItem('Special Leave MIS', '1'), getItem('Service Master Report', '2'),getItem('Service Master Report by filter','3')], ''),
//     getItem('Approver Menu', 'g4', null, [getItem('Leave Approver', '1'), getItem('Initiate Leave', '2'),getItem('Attendance Approver','3'),getItem('Leave Spl Approver','4'),getItem('Attendance Sheet - My staff','5'),getItem('Staff Profile','6'),getItem('Staff Profile 1','7'),getItem('Store Indent Approver','8'),getItem('Event Approve','9'),getItem('Payment Approver','10'),getItem('LOAN STATUS','11'),getItem('Budget report','12'),getItem('Purchase Provisional Approve','13')], ''),
//     getItem('Employee Master', 'g5', null, [getItem('Employee Data', '1'), getItem('Consultant Details', '2'),getItem('Research Profile Report','3')], ''),
//     getItem('HR Menu', 'g6', null, [getItem('Job Portal', '1'), getItem('Holiday Calendar', '2'),getItem('Cancel Leaves - Individual','3'),getItem('Designation Priority','4'),getItem('Employee Attendance grid','5'),getItem('JOB PORTAL1','6'),getItem('Staff Assessment','7'),getItem('Self  Assessment','8'),], ''),
//     getItem('My Menu', 'g7', null, [getItem('Leave Apply', '1'), getItem('Attendance Regularization', '2'),getItem('Punching Details','3'),getItem('Attendance Report','4'),getItem('Pay Slip','5'),getItem('Service Request/Event Creation','6'),getItem('My Profile','7'),getItem('Event Report','8'),getItem('Travel desk','9'),getItem('Self Assessment - Monthly','10'),getItem('Custodian','11'), ], ''),
//   ]),

//   getItem('Student Module', 'sub4', <SiReasonstudios />, [
//     getItem('Accounts Tab', 'g1', null, [getItem('Student ledger', '1'), getItem('Permitted For Exam Report', '2')], ''),
//     getItem('Admin - Students', 'g2', null, [getItem('Dashboard Report - STD', '3'), getItem('View Admissions - User wise', '4'),getItem('Report by Category - Summary','5')], ''),
//     getItem('Hostel', 'g3', null, [getItem('Hostel Due Report', '3')], ''),
//     getItem('Student Fees','g4',null,[getItem('Due Report','1'),getItem('Due report - Board','2')],''),
//     getItem('Student Master','g5',null,[getItem('Student search','1'),getItem('Active Students Master','2'),getItem('My Profile1dummy','3'),'']),
//   ]),

//   getItem('Inventory Module', 'sub5', <MdOutlineInventory />, [
//     getItem('Repport', 'g1', null, [getItem('PO Report', '1'), getItem('Stock Indent Report', '2'),getItem('Inventory Report by Filter','3'),getItem('GRN Report','4')], ''),
//     getItem('Action', 'g2', null, [getItem('Purchase Indent Request', '1'), getItem('Store Indent Request', '2'),getItem('Approve PO','3'),getItem('Refreshment Indent request','4'),getItem('Catering master','5')], ''),
//     getItem('Master', 'g3', null, [getItem('Stock Register', '1')], ''),
//   ]),

// ];

// const Navigationbar = () => {
//   const onClick = (e) => {
//     console.log('click ', e);
//   };
//   const showHideMenu = () => {
//     showMenu ? setShowMenu(false) : setShowMenu(true);
//   }
// const [showMenu, setShowMenu] = useState(false);

//   return (
//     <>
//     <FaBars onClick={showHideMenu} />
//     {showMenu && <Menu
//       onClick={onClick}
//       style={{
//         width: 250,fontSize:15,
//       }}
//       defaultSelectedKeys={['1']}
//       // defaultOpenKeys={['sub1']}
//       mode="inline"
//       items={items}
//     />}</>
//   );
// };

// export default Navigatiobar;