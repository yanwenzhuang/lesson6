import React from "react";
import Art from "./components/artCalculator";
import Mathe from "./components/MathCalulator";
import dataDemo from "./demoData";
import "./App.scss";

import profile, { NameContext, EmailContext } from "./context/profieContext";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _Average: null,
      _Subject: [],
      showArt: true,
      showMath: true,
      extras_Average: null,
      email: profile.email,
      name: profile.name
    };
    this.extras = {
      art: 0,
      mathe: 5
    };
    dataDemo.aerageChangeCb = _Average => {
      this.setState({
        _Average
      });
      this.handelExtras_Average();
    };
    dataDemo.subjectChangeCb = _Subject => {
      this.setState({
        _Subject
      });
    };
  }
  changeContextValue = e => {
    e.persist();
    //在当前组件修改要显示的2个context值 一个name， 一个email
    this.setState({
      nameContext: {name:e.target.value,changeName: this.changeName} 
    })
  };
  handelExtras = e => {
    //同步附加分数到当前组件
    this.extras[e.code] = e.extras;
  };
  handelExtras_Average = () => {
    // 计算带附加分的平均数
    let extras_Average = null;
    let total = 0;
    dataDemo._TotalSubject.forEach(e =>{
      total = e.score + parseInt(this.extras[e.code],10);
    });
    extras_Average= (total / dataDemo._TotalSubject.length).toFixed(2);
    this.setState({
      extras_Average
    });
  };
  toggle = e => {
    e.persist();
    //显示隐藏计算器组件
    const value = e.target.value;
    this.setState({
      [`show${value}`]:!this.state[`show${value}`]
    });
  };
  render() {
    return (
      <div className="average_warp">
        <p>
          email:<input value={this.state.email} onChange = { e =>{
            this.setState({
              email: e.target.value
            });
          }} style = {{width: "200px"}} />
        </p>
        <p>
          name:<input value={this.state.name} />
        </p>
        <p>
          _Subject:{this.state._Subject.map( e =>
            <span key={e.code}>
              {e.code}:{e.score}/
            </span>
          )}
        </p>
        <p>
          _Average:{this.state._Average}
        </p>
        <p>
          Extras_Average: {this.state.extras_Average}
        </p>
        <div className="Calculator_warp">
          <div>
            <button onClick={this.toggle} value="Art">
              显示/影藏
            </button>
            {/*通过NameContext.Provider向Art组件提供相关值*/}
            {/*在<Art>组件上通过自定义属性传值利用 prop render的方式在子组件渲染附加分数的组件，并且实现在子组件修改附加分值的时候要在当前组件保存附加分数的值*/}
            <NameContext.Provider value={this.state.nameContext}>
            {this.state.showArt &&
              <Art 
                title="请计算美术成绩" 
                onExtrasChange={this.handelExtras}
                extrasElm = {(extras, handelExtras) =>{
                  this.extras.art = extras;
                  return (
                    <p>
                      extras:<input type="number" name="art" value={extras} onChange={handelExtras} />
                    </p>
                  )
                }}
            />}
            </NameContext.Provider>
          </div>
          <div>
            <button onClick={this.toggle} value="Math">
              显示/影藏
            </button>
            {/*通过EmailContext.Provider向Mathe组件提供相关值*/}
            <EmailContext.Provider value={this.state.email}>
            {this.state.showMath &&
              <Mathe title="请计算数学成绩">
                {/*在<Mathe>组件的内部定义附加分数的组件，并且实现能同步修改和显示附加分数的值*/}
                <p>
                  extras:<input 
                    type="range"
                    min="-20"
                    max="20"
                    step="5"
                    name="mathe"
                    value={this.state.extras}
                    onChange={e =>{
                      const extras = e.target.value;
                      this.handelExtras({
                        code:"mathe",
                        extras
                      });
                      this.setState({ extras })
                    }}
                    />
                    <span>{this.state.extras}</span>
                </p>
              </Mathe>}
            </EmailContext.Provider>
          </div>
        </div>
      </div>
    );
  }
}
// App.contextType = NameContext;
export default App;
