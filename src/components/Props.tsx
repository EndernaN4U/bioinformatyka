import React, { useState } from 'react'
import BioInformatyka from '../static/bioInfo'

export default function Props({data, inf}:{data: any, inf: BioInformatyka}) {

    const [more,setMore] = useState(false);

  return (
    <div className='protein'>
        <button onClick={()=>setMore(!more)}>{(more)?"Less info":"👩🏿"}</button> 
        <p>sequence: {data.sequence}</p>
        <div style={{ width: '100%', overflow: 'auto' }}> {data.svg} </div>
        {
            (more)?
            <>
            <p>three letter sequence: {data.longSequence}</p>
            <p>length: {data.length}</p>
            <p>gravy: {data.gravy}</p>
            <p>mass: {data.mass}</p>
            <p>net charge: {data.netCharge}</p>
            <p>isoelectric point: {data.isoelectricPoint}</p>
            </>:<></>
        } 
    </div>
  )
}
