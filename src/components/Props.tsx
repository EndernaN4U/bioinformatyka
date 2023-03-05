import React, { useState } from 'react'
import BioInformatyka from '../static/bioInfo'
import { Scatter, Bar } from "react-chartjs-2";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title,CategoryScale, ArcElement, BarElement } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, ArcElement, BarElement);


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
            <p>isoelectric point: {data.isoelectricPoint.isoelectricPoint}</p>
            <p>isoelectric point chart</p>
            <Scatter
            data={{
                  datasets: [{
                    data: data.isoelectricPoint.chartData,
                    borderWidth: 0.2
                  }]    
                }}
            />
            <p> number of aminoacids in the sequence </p>
            {console.log(data.occurencesChart)}
            <Bar
            data={{
                labels: data.occurencesChart.labels,
                  datasets: [{
                    data: data.occurencesChart.amounts,
                    borderWidth: 0.2
                  }]
                }}
            />

            </>:<></>
        } 
    </div>
  )
}
