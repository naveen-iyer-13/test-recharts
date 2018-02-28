import React, {Component} from 'react'
import {connect} from 'react-redux'
import './styles/list.css'
import Select from 'antd/lib/select'
import Slider from 'antd/lib/slider'
import axios from 'axios'
import InputNumber from 'antd/lib/input-number'
import 'antd/dist/antd.css';
// import {getData} from './redux/actions'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class Container extends Component{
  constructor(props){
    super(props)
    this.state = {
      isOpen: false,
      selectedRow: [],
      selectedForecast: 6,
      selectedGrowth: 'linear',
      multiplier: 1,
      numberOfMonths: 1,
      currentMonth: 6,
      sliderValue: 60,
      data: []
    }
    this.closeModal=this.closeModal.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const { selectedGrowth, currentMonth, selectedForecast, numberOfMonths, sliderValue } = this.state;
    axios.get('https://serene-caverns-87558.herokuapp.com/predict?type='+selectedGrowth+'&c_m='+currentMonth+'&t_m='+selectedForecast+'&f_m='+numberOfMonths+'&c_v=50&s_v='+sliderValue)
    .then(response => {
      this.convertData(response.data.data.predict)
    })
    .catch(error => {
      // this.convertData(data.predict)
    })
  }

  convertData(data) {
    var past = data.past
    past[past.length] = 50
    var pastArray = []
    var futureArray = []
    data.past.map((value, index) => {
      if (index === past.length-1) {
        pastArray.push({name: months[index], pastValue: value, futureValue: 50})
      }
      else {
        pastArray.push({name: months[index], pastValue: value})
      }
    })
    data.future.map((value, index) => {
      futureArray.push({name: months[index+past.length], futureValue: value})
    })
    var joinedArray = pastArray.concat(futureArray)
    this.setState({data: joinedArray})
  }


  // componentDidMount() {
  //   this.props.getData()
  //   setInterval(() => this.props.getData(), 20000)
  // }

  closeModal() {
    this.setState({isOpen: false})
  }

  onSelectRow(selectedRow) {
    this.setState({selectedRow: selectedRow, isOpen: true})
  }

  render(){
    var multiplier = <div />
    if (this.state.selectedGrowth == "exp") {
      multiplier =
        <div style={{margin: '20px 30px 20px 0px'}}>
          <div style={{marginBottom: 10}}>
            Forecast Period
          </div>
          <InputNumber min={1} max={100} defaultValue={1} onChange={(multiplier) => this.setState({multiplier}, () => this.getData())} />
        </div>
    }
    return(
      <div style={{display: 'flex'}}>
        <div style={{ marginTop: 150}}>
          <div style={{display: 'flex', width: 600, marginLeft: 50}}>
            <div style={{margin: '20px 30px 20px 0px'}}>
              <div style={{marginBottom: 10}}>
                Forecast Period
              </div>
              <Select value={this.state.selectedForecast} onSelect={(selectedForecast) => this.setState({selectedForecast}, () => this.getData())} style={{width: 200}}>
                <Select.Option key="3" value="3">3 Months</Select.Option>
                <Select.Option key="6" value="6">6 Months</Select.Option>
                <Select.Option key="12" value="12">12 Months</Select.Option>
              </Select>
            </div>
            <div style={{margin: '20px 30px 20px 0px'}}>
              <div style={{marginBottom: 10}}>
                Growth
              </div>
              <Select value={this.state.selectedGrowth} onSelect={(selectedGrowth) => this.setState({selectedGrowth}, () => this.getData())} style={{width: 200}}>
                <Select.Option key="linear" value="linear">Linear</Select.Option>
                <Select.Option key="exp" value="exp">Exponential</Select.Option>
              </Select>
            </div>
            {multiplier}
          </div>
          <div style={{margin: 50, display: 'flex'}}>
            <div>
              <div style={{marginBottom: 10}}>
                Timeframe
              </div>
              <InputNumber min={1} max={100} value={this.state.numberOfMonths} onChange={(numberOfMonths) => this.setState({numberOfMonths}, () => this.getData())} />
            </div>
            <div style={{padding: 30, width: 300}}>
              <Slider defaultValue={30} disabled={false} value={this.state.sliderValue} onChange={(sliderValue) => this.setState({sliderValue}, () => this.getData())}/>
            </div>
            <div className="page-container" style={{float: 'right', marginLeft: 100}}>
              <AreaChart width={600} height={400} data={this.state.data}
                    margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip label='name'/>
                <Area type='linear' dataKey='pastValue' stroke='#8884d8' fill='lightGrey' />
                <Area type='linear' dataKey='futureValue' stroke='#8884d8' fill='lightBlue' />
              </AreaChart>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(Container);
