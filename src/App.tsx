import React, { useState } from 'react';
import './App.css';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import Editor from 'react-simple-code-editor';
import { Card, Checkbox, Typography } from '@material-tailwind/react';
import { analyze } from './utils/analyze';
import { Token } from './utils/types';
import { uniqueId } from 'lodash';

function App() {
  const [code, setCode] = useState(
    `int main(){
  printf("Write your code here!");
}`);
  const [err, setErr] = useState<string>('')
  const [tokens, setTokens] = useState<(Token & {id : string})[]>([])
  return (
    <div className="App">
      <div className='container mx-auto flex flex-col items-center gap-4 mt-2'>
        <h1 className='text-2xl font-bold'>Analisis Leksikal Pada Kode Pemrograman “C” Menggunakan Deterministic Finite Automata</h1>
        <div className='w-full flex flex-col'>
          <span className='text-xs w-max text-gray-500'>click text area to edit</span>
          <div className='border border-gray-400 w-full'>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => highlight(code, languages.c, 'c')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={()=>{setErr('');try{setTokens(analyze(code).map(c=>{return{...c, id : uniqueId()}}))}catch(err){if (err instanceof Error) setErr(err.message)}}}>
            Analyze Token
          </button>
          {/* <Checkbox crossOrigin={true} color='blue' label="Animate analyzer?" /> */}
        </div>
        { !err 
        ? <Card className="h-full w-full overflow-hidden mb-5">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Karakter
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Tipe
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.map(({type, value, id}) => (
                  <tr key={id} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {value}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {type}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card> : <div className='text-red-500'>{err}</div>
        }
      </div>
    </div>
  );
}

export default App;
