import React, { useState, useEffect } from "react";
import axios from "axios";
import * as echarts from "echarts";
import styles from "./LineChart.module.css";

function LineChart() {
  const [select, setSelect] = useState("ethereum");
  const [data, setData] = useState([]);
  const [toggleTable, setToggleTable] = useState(false);
  const [xValue, setXValue] = useState("time");
  const [yValue, setYValue] = useState("value");
  const [xName, setXName] = useState("Time");
  const [yName, setYName] = useState("Price");






  const handleToggleTable = () => {
    setToggleTable(!toggleTable);
    if (toggleTable === true) {
      setXValue("time");
      setYValue("value");    
      setXName("Time");
      setYName("Price");    
     }
    else{
      setXValue("value");
      setYValue("time");  
      setXName("Price");
      setYName("Time"); 
    }
  };

  useEffect(() => {
    fetchData();
  }, [select]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${select}/market_chart?vs_currency=usd&days=365&interval=daily`
      );
      setData(response.data.prices);
    } catch (error) {
      console.error("Error:", error);
    }
  };
const chartDispaly = () => {
 // console.log(data);


 const chart = echarts.init(
   document.getElementById("line-chart"),
   "dark"
 );
 console.log(xValue, yValue);


 const option = {
   title: {
     text: `Price Chart for ${select}`,
   },
   tooltip: {
     trigger: "axis",
   },
   xAxis: {
     type: xValue,
     name : xName
   },
   yAxis: {
     type: yValue,
     name : yName
   },
   series: [
     {
       data: data?.map(([timestamp, value]) => ({
         name: new Date(timestamp).toLocaleDateString(),
         value: [timestamp, value],
       })),
       type: "line",
       smooth: true,
       areaStyle: {},
     },
   ],
 };

 chart.setOption(option);
}
  useEffect(() => {
   
   chartDispaly()
  }, [select, data,toggleTable,xValue, yValue]);

  return (
    <div className={styles.chartcontainer}>

      <div className={styles.menu}>
    <div className={styles.leftMenu}>
    <label>Select The Desire Asset Here :</label>
        <select style={{padding : "5px 10px"}} value={select} onChange={(e) => setSelect(e.target.value)}>
          <option value="ethereum">Ethereum</option>
          <option value="dogecoin">Dogecoin</option>
          <option value="solana">Solana</option>
          <option value="bitcoin">Bitcoin</option>
        </select>
    </div>
<div>
        <button onClick={handleToggleTable}>Toggle Table</button>
</div>

      </div>

      <div id="line-chart" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}

export default LineChart;
