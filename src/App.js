import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import { AgGridReact } from 'ag-grid-react';
import '../node_modules/ag-grid-community/dist/styles/ag-grid.css';
import '../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';
import Spinner from './UI/Spinner';
import { Route, Link } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import  FontAwesomeIcon  from '@fortawesome/react-fontawesome';
import  faInfoCircle  from '@fortawesome/free-solid-svg-icons';
import Aux from './hoc/Auxiliary';
import Modal from './UI/Modal/Modal';



// library.add(faStroopwafel);

class App extends Component {
    state = {
        loading: true,
        data: null,
        columnDefs: [
                {headerName: "Source Address", field: "source"},
                {headerName: "Destination Address", field: "destination"},
                {headerName: "Bytes In", field: "bytesIn"},
                {headerName: "Bytes Out", field: "bytesOut"},
                {headerName: "Packets In", field: "packetsIn"},
                {headerName: "Packets Out", field: "packetsOut"},
                {headerName: "Application Breakdown", field: "appBreakdown"}
            ],
        rowData: [],

        //Modal State properties and data
        columnDefsModal: [
                {headerName: "Application Name", field: "appName"},
                {headerName: "Port Number", field: "portNumber"},
                {headerName: "Protocol", field: "protocol"},
                {headerName: "Bytes In", field: "bytesIn"},
                {headerName: "Bytes Out", field: "bytesOut"},
                {headerName: "Packets In", field: "packetsIn"},
                {headerName: "Packets Out", field: "packetsOut"}
        ],
        rowDataModal: [],
        modalShow: false,
        dialogModal: null
    }

    componentDidMount() {
        axios.get('ag_netflow.json')
            .then(response => {
                // console.log(response.data);
                let data = response.data.splice(0,25);
                this.setState({data: data})
            })
            .then(()=> {
                this.state.data.map( val => {
                    var temp = {
                        source: '',
                        destination: '',
                        bytesIn: '',
                        bytesOut: '',
                        packetsIn: '',
                        packetsOut: '',
                        appBreakdown: ''
                    };
            
                    let result = Object.keys(val).map((res)=>res);
                    result.splice(0,2);
                    result.splice(6,1);
                    
                    var i=0;
                    for (var v in temp) {
                        temp[v]=val[result[i]];
                        i++;
                    }

                    const beferring = [...this.state.rowData];
                    beferring.push(temp);
                    
                    

                    this.setState({rowData: beferring});
                })
            })
            .then(()=> {
                this.setState({loading: false})
                // console.log(this.state.rowData)  
            })
    }


    myRowClickedHandler = (event) => {                                 //Function for modal window
        var rowNumber = event.rowIndex; 
        console.log('the row was clicked', event, rowNumber);
        axios.get('ag_netflow.json')                              
            .then(response => {
                let data = response.data.splice(rowNumber,1);
                let dataModal  = data[0]["applicationBreakdown"];
                // data.map((val)=>val["applicationBreakdown"]);
                // console.log('Data', data, "Data modal is", dataModal);
                console.log(data)

                dataModal.map( (val) => {
                    var temp = {
                        portNumber: '',
                        appName: '',
                        protocol: '',
                        bytesIn: '',
                        bytesOut: '',
                        packetsIn: '',
                        packetsOut: ''
                    };
            
                    let result = Object.keys(val).map((res)=>res);
                    // result.splice(0,2);
                    // result.splice(6,1);
                    console.log('result is' + result)
                    
                    var i=0;
                    for (var v in temp) {
                        temp[v]=val[result[i]];
                        i++;
                    }

                    let beferring = [...this.state.rowDataModal];
                    beferring.push(temp);
                    
                    

                    this.setState({rowDataModal: beferring, modalShow: true});
                })
                this.setState({modalShow: true});
                console.log(this.state.rowDataModal)
            })
    }

    modalCloseHandler = () => {
        let temp=[];
        this.setState({modalShow: false, rowDataModal: temp});
    }

    render() {


        let table = <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}
                        onRowClicked={this.myRowClickedHandler}>
                    </AgGridReact>
        if (this.state.loading) {
            table = <Spinner />
        }

        let modal = "";
        if (this.state.modalShow) {
            modal =  <Aux>
                        <Modal show={this.state.modalShow}
                               modalClosed={this.modalCloseHandler}
                               columnDefs={this.state.columnDefsModal}
                               rowData={this.state.rowDataModal}>
                        </Modal>
                    </Aux>
        }

        return (
                <div 
                    className="ag-theme-balham"
                    style={{ 
                        margin: '0 auto',
                        height: '500px', 
                        width: '80%' }}>
                    {table}
                    {modal}
                </div>
               
        );
    }
}

export default App;
