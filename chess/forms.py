from django import forms


class SearchForm(forms.Form):
    white = forms.CharField(required=False, widget=forms.TextInput(attrs={'autocomplete': 'off',
                                                                          'class': 'form-control mr-3',
                                                                          'placeholder': 'white\'s player'}))
    black = forms.CharField(required=False, widget=forms.TextInput(attrs={'autocomplete': 'off',
                                                                          'class': 'form-control mr-2',
                                                                          'placeholder': 'black\'s player'}))
    ignore_color = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={
                                                                          'class': 'form-check-input mr-2 ml-2',
                                                                        }))
                                                                        