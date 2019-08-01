import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import { handleRefreshAccount, handleRefreshUrl, checkAccountAvailable, clear } from '../../actions/account'

import PageContainer from '../common/PageContainer';
import FormButton from '../common/FormButton'
import SendMoneyFirstStep from './SendMoneyFirstStep'
import SendMoneySecondStep from './SendMoneySecondStep'
import SendMoneyThirdStep from './SendMoneyThirdStep'

class SendMoney extends Component {
   state = {
      loader: false,
      step: 1,
      note: '',
      expandNote: false,
      paramAccountId: false,
      accountId: '',
      amount: '',
      amountStatus: ''
   }

   componentDidMount() {
      this.wallet = new Wallet()
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.props.history)
      
      const paramId = this.props.match.params.id

      this.setState(() => ({
         loader: true
      }))

      if (paramId) {
         this.props.checkAccountAvailable(paramId).then(({ error }) => {
            this.setState(() => ({
               loader: false,
               accountId: paramId
            }))

            if (error) return

            this.setState(() => ({
               paramAccountId: true
            }))
         })
      } else {
         this.setState(() => ({
            loader: false
         }))
      }
   }

   componentWillUnmount = () => {
      this.props.clear()
   }

   handleGoBack = () => {
      this.setState(() => ({
         step: 1
      }))
   }

   handleCancelTransfer = () => {
      this.props.clear()

      this.setState(() => ({
         step: 1,
         note: '',
         amount: '',
         accountId: '',
         successMessage: false,
         paramAccountId: false,
      }))

      this.props.history.push('/send-money')
   }

   handleNextStep = (e) => {
      e.preventDefault()
      const { step, accountId, amount} = this.state;

      if (step === 2) {
         this.setState(() => ({
            loader: true
         }))

         this.wallet.sendMoney(accountId, amount)
            .then(() => {
               this.props.handleRefreshAccount(this.props.history)

               this.setState(state => ({
                  step: state.step + 1
               }))
            })
            .catch(console.error)
            .finally(() => {
               this.setState(() => ({
                  loader: false
               }))
            })
         return;
      }

      this.setState(state => ({
         step: state.step + 1,
         amount: +state.amount
      }))
   }

   handleChange = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value
      }))
      console.log("amount in the [sendmoney.js], ", this.state.amount,typeof this.state.amount)
   }

   handleExpandNote = () => {
      this.setState(() => ({
         expandNote: true
      }))
   }

   isLegitForm = () => {
      const { paramAccountId, amount, amountStatus } = this.state
      const { requestStatus } = this.props
      return paramAccountId
      ? ((amount) > 0 && amountStatus === '')
      : (requestStatus && requestStatus.success && (amount) > 0 && amountStatus === '')
   }

   render() {
      const { step, loader } = this.state
      const { formLoader, requestStatus } = this.props

      return (
         <PageContainer
            title={step === 3 ? `Success!` : `Send Money`}
            bottom={step === 2 && (
               <FormButton
                  onClick={this.handleCancelTransfer}
                  color='link gray bold'
                  disabled={loader}
               >
                  Cancel Transfer
               </FormButton>
            )}
            type='center'
         >
            {step === 1 && (
               <SendMoneyFirstStep
                  handleNextStep={this.handleNextStep}
                  handleChange={this.handleChange}
                  isLegitForm={this.isLegitForm}
                  formLoader={formLoader}
                  requestStatus={requestStatus}
                  {...this.state}
               />
            )}
            {step === 2 && (
               <SendMoneySecondStep
                  handleNextStep={this.handleNextStep}
                  handleExpandNote={this.handleExpandNote}
                  handleGoBack={this.handleGoBack}
                  {...this.state}
               />
            )}
            {step === 3 && <SendMoneyThirdStep {...this.state} />}
         </PageContainer>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl,
   checkAccountAvailable,
   clear
}

const mapStateToProps = ({ account }) => ({
   ...account
})

export const SendMoneyWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(SendMoney))
