import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; // You can use 'isomorphic-fetch' for server-side fetch

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Replace 'https://example.com/your-csv-file.csv' with the actual URL of your CSV file
    const csvURL = 'https://example.com/your-csv-file.csv';

    const response = await fetch(csvURL);
    if (response.ok) {
      const fileContents = await response.text();

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="your-csv-file.csv"');
      res.status(200).send(fileContents);
    } else {
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    console.error('Error serving CSV file:', error);
    res.status(500).send('Internal Server Error');
  }
}