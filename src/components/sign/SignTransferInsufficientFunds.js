import React from 'react'
import { withRouter } from 'react-router-dom'

import FormButton from '../common/FormButton'
import MobileContainer from './MobileContainer'

import { Image, Grid } from 'semantic-ui-react'

import ProblemsImage from '../../images/icon-problems.svg'

const SignTransferInsufficientFunds = ({ handleDeny, handleAddFunds }) => (
   <MobileContainer>
      <Grid>
         <Grid.Row centered>
            <Grid.Column
               textAlign='center'
               className='authorize'
               
            >
               <Image src={ProblemsImage} />
            </Grid.Column>
         </Grid.Row>
         <Grid.Row className='title'>
            <Grid.Column
               as='h2'
               textAlign='center'
            >
               <span className='font-bold'>Insufficient Funds</span>
            </Grid.Column>
         </Grid.Row>
         <Grid.Row className='sub'>
            <Grid.Column
               textAlign='center'
               computer={16}
            >
               Here are some details that will help you.
            </Grid.Column>
         </Grid.Row>
      </Grid>
      <Grid>
         <Grid.Row centered>
            <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
               <FormButton
                  color='gray-white'
                  onClick={handleDeny}
               >
                  CANCEL
               </FormButton>
               <FormButton
                  type='submit'
                  color='blue'
                  onClick={handleAddFunds}
               >
                  ADD FUNDS
               </FormButton>
            </Grid.Column>
         </Grid.Row>
         <Grid.Row className='contract'>
            <Grid.Column>
               Contract: @contractname.near
            </Grid.Column>
         </Grid.Row>
      </Grid>
   </MobileContainer>
)

export default withRouter(SignTransferInsufficientFunds)