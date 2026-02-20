import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export const exportPublicationsToWord = async (publications) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'ОТЧЕТ ПО ИЗДАНИЯМ',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Всего изданий: ${publications.length}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('ID')],
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Индекс')],
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Вид')],
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Название')],
                    width: { size: 40, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Цена (руб./мес.)')],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              ...publications.map((pub) =>
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(pub.id.toString())],
                    }),
                    new TableCell({
                      children: [new Paragraph(pub.index)],
                    }),
                    new TableCell({
                      children: [new Paragraph(pub.type)],
                    }),
                    new TableCell({
                      children: [new Paragraph(pub.title)],
                    }),
                    new TableCell({
                      children: [new Paragraph(parseFloat(pub.monthlyPrice).toFixed(2))],
                    }),
                  ],
                })
              ),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('ИТОГО:')],
                    columnSpan: 4,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: publications
                              .reduce((sum, p) => sum + parseFloat(p.monthlyPrice), 0)
                              .toFixed(2),
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: '',
            spacing: { before: 400 },
          }),
          new Paragraph({
            text: 'СТАТИСТИКА',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Газет: ${publications.filter((p) => p.type === 'газета').length}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Журналов: ${publications.filter((p) => p.type === 'журнал').length}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Средняя цена: ${(
                  publications.reduce((sum, p) => sum + parseFloat(p.monthlyPrice), 0) /
                  publications.length
                ).toFixed(2)} руб.`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Минимальная цена: ${Math.min(
                  ...publications.map((p) => parseFloat(p.monthlyPrice))
                ).toFixed(2)} руб.`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Максимальная цена: ${Math.max(
                  ...publications.map((p) => parseFloat(p.monthlyPrice))
                ).toFixed(2)} руб.`,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Отчет_по_изданиям_${new Date().toISOString().split('T')[0]}.docx`);
};

export const exportSubscriptionsToWord = async (subscriptions, recipients, publications) => {
  const groupedByRecipient = subscriptions.reduce((acc, sub) => {
    const recipientId = sub.recipientId || sub.recipient?.id;
    if (!acc[recipientId]) {
      acc[recipientId] = [];
    }
    acc[recipientId].push(sub);
    return acc;
  }, {});

  const totalAmount = subscriptions.reduce((sum, sub) => {
    const pub = publications.find((p) => p.id === (sub.publicationId || sub.publication?.id));
    if (pub) {
      return sum + parseFloat(pub.monthlyPrice) * sub.duration;
    }
    return sum;
  }, 0);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'ОТЧЕТ ПО ПОДПИСКАМ',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Всего подписок: ${subscriptions.length}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Общая стоимость всех подписок: ${totalAmount.toFixed(2)} руб.`,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          new Paragraph({
            text: 'ВСЕ ПОДПИСКИ',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('ID')],
                    width: { size: 8, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Получатель')],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Издание')],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Срок')],
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Начало')],
                    width: { size: 12, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Стоимость')],
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              ...subscriptions.map((sub) => {
                const recipient = recipients.find((r) => r.id === (sub.recipientId || sub.recipient?.id));
                const publication = publications.find((p) => p.id === (sub.publicationId || sub.publication?.id));
                const cost = publication
                  ? parseFloat(publication.monthlyPrice) * sub.duration
                  : 0;

                return new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(sub.id.toString())],
                    }),
                    new TableCell({
                      children: [new Paragraph(recipient?.fullName || 'Неизвестно')],
                    }),
                    new TableCell({
                      children: [new Paragraph(publication?.title || 'Неизвестно')],
                    }),
                    new TableCell({
                      children: [new Paragraph(`${sub.duration} мес.`)],
                    }),
                    new TableCell({
                      children: [new Paragraph(`${sub.startMonth}/${sub.startYear}`)],
                    }),
                    new TableCell({
                      children: [new Paragraph(`${cost.toFixed(2)} руб.`)],
                    }),
                  ],
                });
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('ИТОГО:')],
                    columnSpan: 5,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${totalAmount.toFixed(2)} руб.`,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: 'ПОДПИСКИ ПО ПОЛУЧАТЕЛЯМ',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          ...Object.entries(groupedByRecipient).map(([recipientId, recipientSubs]) => {
            const recipient = recipients.find((r) => r.id === parseInt(recipientId));
            const recipientTotal = recipientSubs.reduce((sum, sub) => {
              const pub = publications.find((p) => p.id === (sub.publicationId || sub.publication?.id));
              return sum + (pub ? parseFloat(pub.monthlyPrice) * sub.duration : 0);
            }, 0);

            return [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${recipient?.fullName || 'Неизвестно'} (${recipient?.code || ''})`,
                    bold: true,
                  }),
                ],
                spacing: { before: 200, after: 100 },
              }),
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph('Издание')],
                      }),
                      new TableCell({
                        children: [new Paragraph('Срок')],
                      }),
                      new TableCell({
                        children: [new Paragraph('Стоимость')],
                      }),
                    ],
                  }),
                  ...recipientSubs.map((sub) => {
                    const publication = publications.find(
                      (p) => p.id === (sub.publicationId || sub.publication?.id)
                    );
                    const cost = publication
                      ? parseFloat(publication.monthlyPrice) * sub.duration
                      : 0;

                    return new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph(publication?.title || 'Неизвестно')],
                        }),
                        new TableCell({
                          children: [new Paragraph(`${sub.duration} мес.`)],
                        }),
                        new TableCell({
                          children: [new Paragraph(`${cost.toFixed(2)} руб.`)],
                        }),
                      ],
                    });
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph('ИТОГО:')],
                        columnSpan: 2,
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `${recipientTotal.toFixed(2)} руб.`,
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ];
          }).flat(),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Отчет_по_подпискам_${new Date().toISOString().split('T')[0]}.docx`);
};
