import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { TextInput, PrimaryButton } from '../component/UIkit'
import { signIn } from '../reducks/users/operations'

const SignIn = () => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const inputEmail = useCallback(
    (event) => {
      setEmail(event.target.value)
    },
    [setEmail],
  )

  const inputPassword = useCallback(
    (event) => {
      setPassword(event.target.value)
    },
    [setPassword],
  )

  return (
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">ログイン</h2>
      <div className="module-spacer--medium"></div>
      <TextInput
        fullWidth={true}
        label={'メールアドレス'}
        multiline={false}
        required={true}
        rows={1}
        value={email}
        type={'email'}
        onChange={inputEmail}
      />
      <TextInput
        fullWidth={true}
        label={'パスワード ６文字以上で入力'}
        multiline={false}
        required={true}
        rows={1}
        value={password}
        type={'password'}
        onChange={inputPassword}
      />
      <div className="module-spacer--medium"></div>
      <div className="center">
        <PrimaryButton
          label={'ログイン'}
          onClick={() => dispatch(signIn(email, password))}
        />
      </div>
    </div>
  )
}

export default SignIn
