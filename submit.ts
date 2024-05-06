import type { NextApiRequest, NextApiResponse } from 'next';
import { CodeInterpreter } from '@e2b/code-interpreter'

async function processInput(input: string, codeInterpreter: CodeInterpreter) {
  // Process the user input using the Code Interpreter
  const result = await codeInterpreter.process(input);

  // Return the processed output
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string }>) {
  if (req.method === 'POST') {
    try {
      const { input } = req.body;
      
      // Initialize Code Interpreter
      const codeInterpreter = await CodeInterpreter.create();

      // Process the user input
      const processedOutput = await processInput(input, codeInterpreter);

      // Close the Code Interpreter
      await codeInterpreter.close();

      // Send the processed output back to the client
      res.status(200).json({ message: processedOutput });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
