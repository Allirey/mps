from django import forms


class SearchForm(forms.Form):
    white = forms.CharField(required=False, widget=forms.TextInput(attrs={'autocomplete': 'off',
                                                                          'class': 'form-control'}))
    black = forms.CharField(required=False, widget=forms.TextInput(attrs={'autocomplete': 'off',
                                                                          'class': 'form-control'}))
    ignore_color = forms.BooleanField(required=False)
