var key="MCAF9B429I44328U";
function getUrl(companyName,SamplingRate)
{
	var url="https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ companyName +"&outputsize=full&apikey=MCAF9B429I44328U";
	if(SamplingRate=="Daily")
     	url="https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ companyName +"&outputsize=full&apikey=MCAF9B429I44328U";
  else if(SamplingRate=="Weekly")
      url="https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol="+ companyName +"&apikey=MCAF9B429I44328U";
  else if(SamplingRate=="Monthly")
       url="https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" +  companyName +"&apikey=MCAF9B429I44328U";
  return url;
}
function getDataPriceToDate(data,year,samplingRate)
{

  var color1=["#00BFFF","#FF00FF","#00008B", "#008000","#FFFF00","#FFA500"," #FF0000"];
  var date=data["Meta Data"]["3. Last Refreshed"];
  var splitedDate=date.split("-");//0th index year
                                  //1st index month
                                  //2nd index day
  var rawData;
  if(samplingRate=="Daily")
    rawData = data["Time Series (Daily)"];
  else if(samplingRate="Weekly")
     rawData = data["Weekly Time Series"];
  else if(samplingRate="Monthly")
     rawData = data["Monthly Time Series"];
  var startYear=splitedDate[0]-year+1;
  var endYear=splitedDate[0];
  var formattedData=[];
  for(var i=0;i<year;i++)
  {
    formattedData[i]={};
    formattedData[i].type='scatter';
    formattedData[i].mode="lines",
    formattedData[i].line={color:color1[i] };
    formattedData[i].x={};
    formattedData[i].y={};
    formattedData[i].x=[];
    formattedData[i].y=[];
  }
  for(var itr in rawData)
  {
      var currentYear=itr.split("-")[0];
      if(currentYear<startYear)
         continue;
      else
      {
          var z=itr.split("-");
          z[0]=startYear;
          var tempDate=z[0]+"-"+ z[1] + "-" + z[2];
          formattedData[currentYear-startYear].x.push(tempDate);
          formattedData[currentYear-startYear].y.push(rawData[itr]["4. close"]); 
          formattedData[currentYear-startYear].name=currentYear;

      }
  }
  return formattedData;
}
function PriceToDate(data,year,samplingRate)
{
    var formattedData=getDataPriceToDate(data,year,samplingRate);
   var layout = {
    margin: {
    l: 20,
    r: 10,
    b: 40,
    t: 10
  },
 };
   // var layout = {title: 'Basic Time Series', };
    var plotData=[];
    for (var itr in formattedData)
         plotData.push(formattedData[itr]);
    Plotly.newPlot('myDiv', plotData, layout);

    
}
function generateGraph(url1,year,samplingRate)
{
  $.ajax({
   url: url1,
   type: 'GET',
   success: function(data,textStatus,xhr) {
     console.log(data);
      PriceToDate(data,year,samplingRate);
   },
    error: function(xhr) {
      alert("Error occurred"+xhr.status);
   },
});

}
function getCompanyName()
{
   var CompanyName=document.getElementById("SeachBox").value;
   var url= getUrl(CompanyName,"Daily");
   generateGraph(url,5,"Daily"); 
  // alert(CompanyName);
}

