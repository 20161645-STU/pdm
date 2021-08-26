import React, { Component } from 'react'
import { Steps, PageHeader, message  } from 'antd'
import './style.less'

import AddParts from './add_part'
import FilesUpload from '../../publicComponents/upload.jsx'

import { connect } from 'react-redux'
import { creatNewParts } from '../store/actionCreaters'

import reqwest from 'reqwest';

import { originalUrl, uploadFilesUrl, createPartUrl } from '../../dataModule/UrlList'
import { Model } from '../../../src/dataModule/testBone'

const { Step } = Steps
const model = new Model();

class AddFilesProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      preStepVisible: false,
    };
  }

  next = (params) => {
    const current = this.state.current + 1;
    this.setState({ current });
    console.log(params)
    this.props.creatNewParts(params)
    this.setState({
      preStepVisible: true
    })
  }

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  //返回按钮
  comeBack = () => {
    const initData = {
      name: '',
      document_type: '',
      project_code: '',
      zss_id: '',
      tag:'',
      tss_type: ''
    }
    this.props.creatNewParts(initData)
    this.props.history.push('/app/part_manage')
  }

  //发送文档
  sentFilesDocuemnts = (partId, formData) => {
    const me = this
  //   for (var value of params.values()) {
  //     console.log(value);
  //  }
    formData.append('fileId', partId) 
    reqwest({
      url: originalUrl + uploadFilesUrl,
      method: 'post',
      processData: false,
      data: formData,
      success: (res) => {
        // console.log(res)
        if (res.message === '上传成功') {
          this.setState({
            fileList: []
          });
          message.success('文件上传成功');
          me.props.history.push('/app/part_manage')
        }
      },
      error: () => {
        message.error('文件上传失败');
      },
    });
  }

   //创建零件描述信息
   createParts = (data, formData) => {
    const me = this
    // console.log('newPart', newPart)
    // for (let i in newPart) {
    // // if (newDraw[i] === '' || newDraw[i] === undefined) {
    // //     message.error('信息未填写完整！')
    // //     return
    // // }
    // }
    model.fetch(
      data,
      createPartUrl,
      'post',
      function (res) {
        message.success('创建零件成功！')
        me.sentFilesDocuemnts(res.data, formData)
      },
      function (error) {
        message.error('创建零件失败！')
      },
      false
      )
  }

  //完成创建
  finishCreate = (formData) => {
    this.createParts(this.props.newPartsData, formData)
    // this.props.history.push('/app/file_manage')
  }

  render() {
    const { current, preStepVisible } = this.state
    const steps = [
      {
        title: '零件信息填写',
        content: <AddParts
                  next={this.next}
                  history={this.props.history}
                />
      },
      {
        title: '文件上传',
        content: <FilesUpload
                    visible={preStepVisible}
                    prev={this.prev}
                    beginUpload={this.finishCreate}
                  />
      }
    ]
    return (
      <div>
        { current === 0 ? 
          <PageHeader
            onBack={() => this.comeBack()}
            title="返回"
          />  : null
        }
        <div  className="stpes">
          <Steps current={current} size="small" className="steps-header">
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
        </div>     
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    newPartsData: state.get('viewsReducer').get('newPartsData').toJS(),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    creatNewParts: data => dispatch(creatNewParts(data)),
  }
}

export default  connect(mapStateToProps, mapDispatchToProps)(AddFilesProcess)
