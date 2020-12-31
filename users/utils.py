def normalize_email(email):
    email = email.lower()
    name, domain = email.split('@')

    if domain in ['gmail.com', 'googlemail.com']:
        email = name.replace('.', '') + '@' + domain

    return email
