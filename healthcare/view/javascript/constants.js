myApp.constant("constants", {
  appTitle: "Health Care",
  login: {
    "background": '//s3.amazonaws.com/scriptr-cdn/healthcare/login-background.jpg',
    "logo": '//s3.amazonaws.com/scriptr-cdn/healthcare/logo.png',
    "poweredBy": '//scriptr-cdn.s3.amazonaws.com/carwash/images/powered-by-scriptr.png'
  },
   sources : {
    "simulator": { 
   	  "mapMarker": {
          url: "//s3.amazonaws.com/scriptr-cdn/healthcare/doctor-marker.png"
   	  }
    }
  },
  sourcesLabels: {
    "simulator": "Tidepool"
  },
  infoWindows: {
    "icons": {
         "clinic": '<img  src="//s3.amazonaws.com/scriptr-cdn/healthcare/clinic.png">',
         "patient": '<img width="38px" src="//s3.amazonaws.com/scriptr-cdn/healthcare/patient.png">',
         "email":'<img  width="32px" src="//s3.amazonaws.com/scriptr-cdn/healthcare/email.png">',
         "cbg":'<img  width="32px" src="//s3.amazonaws.com/scriptr-cdn/healthcare/cbg.png">',
         "smbg": '<img  width="32px" src="//s3.amazonaws.com/scriptr-cdn/healthcare/smbg.png">',
         "address": '<img alt="Embedded Image"  src="//s3.amazonaws.com/scriptr-cdn/common/images/location.png" />',
         "time": '<img  alt="Embedded Image"    src="//s3.amazonaws.com/scriptr-cdn/common/images/time.png" />',
         "device": ' <img   alt="Embedded Image" src="//s3.amazonaws.com/scriptr-cdn/common/images/device.png">'
     }
  },
   /** {
   "source": "tidepool",
   "units": "mmol/L",
   "type": "smbg",
   "alert_type": "HIGH_SMBG",
   "id": "InsOmn_MF123123",
   "smbg": "11.229759",
   "sensor": "omnipod",
   "subType": "manual",
   "time": "2020-04-02T17:32:35+0000",
  }**/
  alertsGrid: [
      {headerName: "Type", field: "type"},
      {headerName: "Value", field: "type", cellRenderer:
       	function(params){
          return params.data[params.value]  + params.data.units;
      	}
      },
      {headerName: "Time", field: "time", cellStyle: {'white-space': 'normal', 'word-break': 'break-all'}},
      {headerName: "Alerts", field: "alert_type", cellStyle: {'white-space': 'normal', 'word-break': 'break-all'}},
      {headerName: "CBG", field: "cbg", hide: true},
      {headerName: "SMBG", field: "smbg", hide: true},
      {headerName: "Units", field: "units", hide: true},
      
  ]
})