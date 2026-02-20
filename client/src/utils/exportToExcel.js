import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportPublicationsToExcel = async (publications) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Издания');

  worksheet.columns = [
    { width: 10 },
    { width: 15 },
    { width: 15 },
    { width: 40 },
    { width: 18 },
  ];

  worksheet.addRow(['ОТЧЕТ ПО ИЗДАНИЯМ']);
  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').font = { bold: true, size: 16 };
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 30;

  worksheet.addRow([
    `Дата формирования: ${new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
  ]);
  worksheet.mergeCells('A2:E2');
  worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.addRow([`Всего изданий: ${publications.length}`]);
  worksheet.mergeCells('A3:E3');
  worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('A3').font = { bold: true };

  worksheet.addRow([]);

  const headerRow = worksheet.addRow(['ID', 'Индекс', 'Вид', 'Название', 'Цена (руб./мес.)']);
  headerRow.font = { bold: true, size: 12 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  publications.forEach((pub) => {
    worksheet.addRow([
      pub.id,
      pub.index,
      pub.type,
      pub.title,
      parseFloat(pub.monthlyPrice).toFixed(2),
    ]);
  });

  const totalRow = worksheet.addRow([
    'ИТОГО:',
    '',
    '',
    '',
    publications.reduce((sum, p) => sum + parseFloat(p.monthlyPrice), 0).toFixed(2),
  ]);
  totalRow.font = { bold: true };
  totalRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFE0B2' },
  };

  worksheet.addRow([]);

  const statsRow = worksheet.addRow(['СТАТИСТИКА']);
  worksheet.mergeCells(`A${statsRow.number}:E${statsRow.number}`);
  worksheet.getCell(`A${statsRow.number}`).font = { bold: true, size: 14 };

  const gasCount = publications.filter((p) => p.type === 'газета').length;
  const journalCount = publications.filter((p) => p.type === 'журнал').length;
  const avgPrice =
    publications.reduce((sum, p) => sum + parseFloat(p.monthlyPrice), 0) / publications.length;
  const minPrice = Math.min(...publications.map((p) => parseFloat(p.monthlyPrice)));
  const maxPrice = Math.max(...publications.map((p) => parseFloat(p.monthlyPrice)));

  worksheet.addRow([`Газет: ${gasCount}`]);
  worksheet.addRow([`Журналов: ${journalCount}`]);
  worksheet.addRow([`Средняя цена: ${avgPrice.toFixed(2)} руб.`]);
  worksheet.addRow([`Минимальная цена: ${minPrice.toFixed(2)} руб.`]);
  worksheet.addRow([`Максимальная цена: ${maxPrice.toFixed(2)} руб.`]);

  const dataStartRow = 5;
  const dataEndRow = dataStartRow + publications.length;
  for (let i = dataStartRow; i <= dataEndRow + 1; i++) {
    ['A', 'B', 'C', 'D', 'E'].forEach((col) => {
      worksheet.getCell(`${col}${i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Отчет_по_изданиям_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportSubscriptionsToExcel = async (subscriptions, recipients, publications) => {
  const workbook = new ExcelJS.Workbook();

  const allSubsSheet = workbook.addWorksheet('Все подписки');

  allSubsSheet.insertRow(1, ['ОТЧЕТ ПО ПОДПИСКАМ']);
  allSubsSheet.mergeCells('A1:F1');
  allSubsSheet.getCell('A1').font = { bold: true, size: 16 };
  allSubsSheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
  allSubsSheet.getRow(1).height = 30;

  allSubsSheet.insertRow(2, [
    `Дата формирования: ${new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
  ]);
  allSubsSheet.mergeCells('A2:F2');
  allSubsSheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

  allSubsSheet.insertRow(3, [`Всего подписок: ${subscriptions.length}`]);
  allSubsSheet.mergeCells('A3:F3');
  allSubsSheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
  allSubsSheet.getCell('A3').font = { bold: true };

  const totalAmount = subscriptions.reduce((sum, sub) => {
    const pub = publications.find((p) => p.id === (sub.publicationId || sub.publication?.id));
    if (pub) {
      return sum + parseFloat(pub.monthlyPrice) * sub.duration;
    }
    return sum;
  }, 0);

  allSubsSheet.insertRow(4, [`Общая стоимость всех подписок: ${totalAmount.toFixed(2)} руб.`]);
  allSubsSheet.mergeCells('A4:F4');
  allSubsSheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
  allSubsSheet.getCell('A4').font = { bold: true, color: { argb: 'FFFF0000' } };

  allSubsSheet.insertRow(5, []);

  allSubsSheet.getRow(6).values = ['ID', 'Получатель', 'Издание', 'Срок (мес.)', 'Начало', 'Стоимость (руб.)'];
  allSubsSheet.getRow(6).font = { bold: true };
  allSubsSheet.getRow(6).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };
  allSubsSheet.getRow(6).alignment = { vertical: 'middle', horizontal: 'center' };

  subscriptions.forEach((sub, index) => {
    const recipient = recipients.find((r) => r.id === (sub.recipientId || sub.recipient?.id));
    const publication = publications.find((p) => p.id === (sub.publicationId || sub.publication?.id));
    const cost = publication
      ? parseFloat(publication.monthlyPrice) * sub.duration
      : 0;

    allSubsSheet.addRow([
      sub.id,
      recipient?.fullName || 'Неизвестно',
      publication?.title || 'Неизвестно',
      sub.duration,
      `${sub.startMonth}/${sub.startYear}`,
      cost.toFixed(2),
    ]);
  });

  const totalRow = allSubsSheet.addRow([
    'ИТОГО:',
    '',
    '',
    '',
    '',
    totalAmount.toFixed(2),
  ]);
  totalRow.font = { bold: true };
  totalRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFE0B2' },
  };

  allSubsSheet.columns = [
    { width: 10 },
    { width: 30 },
    { width: 35 },
    { width: 15 },
    { width: 15 },
    { width: 18 },
  ];

  const byRecipientSheet = workbook.addWorksheet('По получателям');

  const groupedByRecipient = subscriptions.reduce((acc, sub) => {
    const recipientId = sub.recipientId || sub.recipient?.id;
    if (!acc[recipientId]) {
      acc[recipientId] = [];
    }
    acc[recipientId].push(sub);
    return acc;
  }, {});

  let currentRow = 1;
  byRecipientSheet.insertRow(currentRow, ['ПОДПИСКИ ПО ПОЛУЧАТЕЛЯМ']);
  byRecipientSheet.mergeCells(`A${currentRow}:C${currentRow}`);
  byRecipientSheet.getCell(`A${currentRow}`).font = { bold: true, size: 16 };
  byRecipientSheet.getCell(`A${currentRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
  byRecipientSheet.getRow(currentRow).height = 30;
  currentRow++;

  Object.entries(groupedByRecipient).forEach(([recipientId, recipientSubs]) => {
    const recipient = recipients.find((r) => r.id === parseInt(recipientId));
    const recipientTotal = recipientSubs.reduce((sum, sub) => {
      const pub = publications.find((p) => p.id === (sub.publicationId || sub.publication?.id));
      return sum + (pub ? parseFloat(pub.monthlyPrice) * sub.duration : 0);
    }, 0);

    currentRow++;
    byRecipientSheet.insertRow(currentRow, [
      `${recipient?.fullName || 'Неизвестно'} (${recipient?.code || ''})`,
    ]);
    byRecipientSheet.mergeCells(`A${currentRow}:C${currentRow}`);
    byRecipientSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
    byRecipientSheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };
    currentRow++;

    byRecipientSheet.getRow(currentRow).values = ['Издание', 'Срок (мес.)', 'Стоимость (руб.)'];
    byRecipientSheet.getRow(currentRow).font = { bold: true };
    byRecipientSheet.getRow(currentRow).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
    currentRow++;

    recipientSubs.forEach((sub) => {
      const publication = publications.find(
        (p) => p.id === (sub.publicationId || sub.publication?.id)
      );
      const cost = publication
        ? parseFloat(publication.monthlyPrice) * sub.duration
        : 0;

      byRecipientSheet.addRow([
        publication?.title || 'Неизвестно',
        sub.duration,
        cost.toFixed(2),
      ]);
      currentRow++;
    });

    const recipientTotalRow = byRecipientSheet.addRow([
      'ИТОГО:',
      '',
      recipientTotal.toFixed(2),
    ]);
    recipientTotalRow.font = { bold: true };
    recipientTotalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFE0B2' },
    };
    currentRow++;
    currentRow++;
  });

  byRecipientSheet.columns = [{ width: 40 }, { width: 15 }, { width: 18 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Отчет_по_подпискам_${new Date().toISOString().split('T')[0]}.xlsx`);
};
