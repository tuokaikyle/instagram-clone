import React from 'react'

const Footer = () => {
  return (
    <footer className='page-footer white'>
      <div className='container'>
        <div className='row'>
          <h5 className='grey-text text-darken-2'>Note</h5>
          <p className='grey-text text-darken-4'>
            This project is clone of Instagram, which uses react useContext and
            useReducer to manage the state, materializecss to outline the UI,
            cloudinary to store the uploaded image and sendgrid to manage the
            emails for password-reseting.
          </p>
          <p className='grey-text text-darken-4'>
            Originally forked from{' '}
            <a href='https://github.com/mukeshphulwani66/Instagram-clone-MERN-Stack'>
              mukeshphulwani66's github repo
            </a>
            , I have added a lot of improvements to this project, include the
            navigation bar, like/unlike, search post, update user profile, etc.
          </p>
          <p className='grey-text text-darken-4'>Kai Tuo 2020</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
