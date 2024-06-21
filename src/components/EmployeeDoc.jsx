import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LetterheadImage from '../../src/assets/auait.jpg';

const EmployeeDoc = () => {
  // Function to generate PDF
  function generatePDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const img = new Image();
    img.src = LetterheadImage;
    img.onload = () => {

      doc.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0); // Black color
  
      // var text = doc.splitTextToSize('having its registered office at 89 & 90, Acharya Dr.Sarvepalli Radhakrishnan Road, Soladevanahalli, Bangalore-560107 duly represented by Shri. B. Premnath Reddy, Secretary of the Society (hereinafter referred to as the Employer,', pageWidth - 35, {})
      // doc.text(text, 14, 30)
      
      // Title
      doc.setFont('helvetica', 'bold');
      doc.text('This Fixed Term Employment Contract is executed As On 10-06-2024, by and between:', 18, 50);
  
      // Employer details
      doc.setFont('helvetica', 'bold');
      doc.text('M/S ACHARYA INSTITUTE OF TECHNOLOGY,', 18, 60);
  
      var width = doc.getTextWidth('M/S ACHARYA INSTITUTE OF TECHNOLOGY,')
      // doc.text('10-06-2024', 18 + width, 50); // Bold date
      doc.setFont('helvetica', 'normal');
      var text = doc.splitTextToSize(
        'having its registered office at 89 & 90, Acharya Dr.Sarvepalli Radhakrishnan Road, Soladevanahalli, Bangalore-560107 duly represented by Shri. B. Premnath Reddy, Secretary of the Society (hereinafter referred to as the Employer, which expression shall, unless repugnant to the context or meaning thereof, be deemed to mean and include its successors and permitted assigns) of the First Part;', pageWidth - 35
      );
      doc.text(text, 18 + width, 65);
  
      // Employee details
      doc.setFont('helvetica', 'bold');
      doc.text('And', 20, 110);
      doc.text('Mr. Sivaraman Masilamani S/o. resident of No: 62/35 TN Housing Board Colony, Nehru Nagar,', 20, 120);
      doc.text('Velachery, Chennai-600042 (hereinafter referred to as the Employee) of the Second Part;', 20, 130);
      doc.setFont('helvetica', 'normal');
  
      doc.text('Each party hereinafter referred to as a Party and collectively hereinafter referred to as the Parties.', 20, 140);
  
      // Agreement details
      doc.text('Both the Parties now wish to set out in writing their understanding relating to such undertaking’s with', 20, 150);
      doc.text('respect to the Fixed Term Employment to the Second Party by the First Party and the parties hereby agree as follows:', 20, 160);
  
      // Appointment and Job Profile
      doc.setFont('helvetica', 'bold');
      doc.text('1. Appointment and Job Profile :', 20, 200);
      doc.setFont('helvetica', 'normal');
      doc.text('a. In pursuit of excellence, the Society pursues/faces tasks related to Accreditation from', 20, 210);
      doc.text('various Statutory/Regulatory Authorities and bodies such as NBA/NAAC/AICTE etc for all the', 20, 220);
      doc.text('Institutes under it, also in pursuit of a University Status, this Employment Contract is for the', 20, 230);
      doc.setFont('helvetica', 'bold');
      doc.text('completion of Adhoc Academic and Non Academic activities involving special', 20, 240);
      doc.setFont('helvetica', 'normal');
      doc.text('Courses/Training/Coaching/Student Data mining/Digitalization of data/Data', 20, 250);
      doc.text('Compiling/Infrastructure Restructuring/Restoration/Repairs etc and any other works as may', 20, 260);
      doc.text('be related for such end purposes.', 20, 270);
      doc.text('b. During the course of this contract, the Employee shall be designated as Software', 20, 280);
      doc.setFont('helvetica', 'bold');
      doc.text('Developer and posted at ACHARYA INSTITUTE OF TECHNOLOGY.', 20, 290);
      doc.setFont('helvetica', 'normal');
      doc.text('c. The Employee hereby agrees to accept to be the employee and accepts the position as a', 20, 300);
      doc.setFont('helvetica', 'bold');
      doc.text('Software Developer under the JMJ Education Society and to be posted at ACHARYA', 20, 310);
      doc.setFont('helvetica', 'normal');
      doc.text('INSTITUTE OF TECHNOLOGY for a fixed period from 10-06-2024 to 31-05-2026 on the', 20, 320);
      doc.text('conditions stipulated hereunder this agreement.', 20, 330);
      doc.text('d. The employee will be responsible for and accept all duties and responsibilities as agreed', 20, 340);
      doc.text('between the employer and Employee.', 20, 350);
      doc.text('e. The Employee’s job title does not define or restrict duties and the Employee may be required', 20, 360);
      doc.text('to undertake other work with in his/her abilities at the request of the Employer and any', 20, 370);
      doc.text('refusal to comply with such requests constitutes a breach of the contract of employment. The', 20, 380);
      doc.text('Employer, however, undertakes that these additional tasks shall be within the training,', 20, 390);
      doc.text('experience or occupational capabilities of the employee concerned and that no employee', 20, 400);
      doc.text('shall suffer any loss of remuneration or status for work done on additional tasks.', 20, 410);
  
      // Save the PDF
      doc.save('employment_contract.pdf');
      };
    };
    // Set the font size and font style
    
  

  return (
    <button onClick={generatePDF}>
      Download PDF
    </button>
  );
};

export default EmployeeDoc;
