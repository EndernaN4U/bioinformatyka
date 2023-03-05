import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react'
import BioInformatyka from '../static/bioInfo'
import Props from './Props';

export default function Solver() {

    const [inf, setBioInfo] = useState(new BioInformatyka());
    const [data,setData] = useState('');
    const [type, setType] = useState('text');
    const [selected, setSelected] = useState("");

    let textRef = createRef<HTMLTextAreaElement>();
    let fileRef = createRef<HTMLInputElement>();


    const [dl,sdl] = useState(new Array<any>);

    const changeData = async()=>{
        if(type==="text"){
            let input = textRef.current?.value!;
            if(input === ""){
                inf.data = [];
                setData("");
                return;
            }
            inf.setData(input);
            setData(input);
        }
        else{
            if(!fileRef.current?.files) return; // No files 
            fileRef.current?.files![0].text().then(data=>{
                inf.setData(data);
                setData(data);
            })
        }   
    } 

    

  return (
    <div>
        <main>
            <div className="container">
                <div className="about">
                    <h2>Protein analysis</h2>
                    <p>
                        The app generates the structure<br />
                        and data of a protein, where output<br />
                        bases on the amino acid string.
                    </p>
                </div>
                <div className="input-section">
                    <div className='inputDiv'>
                        <label>Text</label>
                        <input type="radio" name="type" checked={(type==="text")} onClick={()=>setType("text")}/>
                    </div>
                   
                    <div className='inputDiv'>
                        <label>File</label>
                        <input type="radio" name="type" checked={(type==="file")} onClick={()=>setType("file")}/>
                    </div>

                    <div style={{display: (type==="file")? "block":"none"}} className='inputDiv'>
                    <input ref={fileRef} type="file" accept='.txt' multiple={false}/>
                    </div>

                    <textarea 
                        style={{display: (type==="text")? "block":"none"}} 
                        ref={textRef} 
                        placeholder="Enter the amino acid string" 
                        id="here" 
                        onInput={changeData}>
                    </textarea>
                    <button onClick={changeData}>Calculate</button>

                </div>
            </div>

            <div className='proteinContainer'>
            {
                inf.data?
                <div>
                    {
                        inf.data.map((rna: any, ind: number)=>{
                            const data = inf.getProperties(rna.sequence);
                            return (
                                <Props data={data} inf={inf} key={ind}/>
                            ) ; 
                        })
                    }
                </div>
                :<></>
            }
            </div>
        </main>
        

        <footer>
            <div className="footer-authors">
            <figure>
                <figcaption>Designed by:</figcaption>
                <ul>
                    <li>Arkadiusz Skupień</li>
                    <li>Adrian Ziembla</li>
                    <li>Karol Marek</li>
                    <li>Maciej Matuszczyk</li>
                    <li>Sebastian Rogóż</li>
                </ul>
            </figure>
            </div>
            <div className="footer-doc">
                <b><a href="#">Download documentation</a></b>
            </div> 
            <div className="footer-copyright">
                &copy; orłyZSŁ
            </div>
        </footer>
    </div>
  )
}
