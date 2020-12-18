// ログイン時のpushはoperationsにまとめる
import { push } from 'connected-react-router'
import { auth, db, FirebaseTimestamp } from '../../firebase/index'
import { signInAction } from './actions'

export const signIn = (email: string, password: string) => {
  return async (dispatch: any) => {
    // バリデーション
    if (email === '' || password === '') {
      alert('未入力の必須入力項目があります')
      return false
    }

    auth.signInWithEmailAndPassword(email, password).then((result) => {
      const user = result.user

      if (user) {
        const uid = user.uid

        // 指定されたuidのデータをfirestoreから取得
        db.collection('users')
          .doc(uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data()

            if (data) {
              dispatch(
                signInAction({
                  isSignedIn: true,
                  role: data.role,
                  uid: uid,
                  username: data.username,
                }),
              )
            }

            dispatch(push('/'))
            return
          })
      }
      return
    })
    return
  }
}

// redux-thunkで作るサインアップメソッド
export const signUp = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  return async (dispatch: any) => {
    // バリデーションを定義 ★実際はもっと充実させる
    if (
      username === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      alert('未入力の必須入力項目があります')
      return false
    }

    if (password !== confirmPassword) {
      alert('パスワードが一致しません。もう一度お試しください。')
      return false
    }

    // firebaseのauthでサインアップ処理実行
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // result.userが入っていればサインアップ成功
        const user = result.user

        if (user) {
          // ユーザ一意のid
          const uid = user.uid
          // 現在のfirebaseが管理している時刻
          const timestamp = FirebaseTimestamp.now()

          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: 'customer',
            uid: uid,
            updated_at: timestamp,
            username: username,
          }

          // dbのドキュメントにはuidを設定しておく
          db.collection('users')
            .doc(uid)
            .set(userInitialData)
            .then(() => {
              dispatch(push('/'))
            })
        }
      })
  }
}