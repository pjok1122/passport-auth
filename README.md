# passport-localStrategy

Passport의 Local Strategy를 이용하여 로그인 기능을 구현했습니다.

회원 정보는 MySQL로 관리하며, 패스워드는 bcrypt를 이용하여 암호화합니다.

회원들은 자신의 글을 등록하고, 타인과 게시글을 공유할 수 있습니다.

자신의 글을 수정하거나 삭제하는 것은 가능하나, sanitize-html을 이용하기 때문에 태그를 사용하는 것은 불가합니다.

# passport-OAuth2.0 Strategy google login

Passport의 google-oauth 전략을 사용하여 구글 로그인 기능을 추가했습니다.

