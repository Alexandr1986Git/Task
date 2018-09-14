import React, {Component} from 'react';
import './Modal.css'
import { AgGridReact } from 'ag-grid-react';
import '../../../node_modules/ag-grid-community/dist/styles/ag-grid.css';
import '../../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';
import Aux from '../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
    render() {
        return (
            <Aux>
                <Backdrop clicked={this.props.modalClosed} show={this.props.show}/>
                <div
                    className="Modal"
                    style={{transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                            opacity: this.props.show ? '1' : '0'
                    }}>
                    <p>Hello</p>
                    <div style={{height: "150px"}}>
                        <AgGridReact
                            columnDefs={this.props.columnDefs}
                            rowData={this.props.rowData}>
                        </AgGridReact>
                    </div>
                    <button onClick={this.props.modalClosed}>Close</button>
                </div>
            </Aux>
        )
    }
}

export default Modal;