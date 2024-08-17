module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'header-max-length': [2, 'always', 120],
    'subject-exclamation-mark': [0, 'always'],
  }
};
