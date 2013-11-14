Eiriksson::Application.routes.draw do
  root 'static#index'
  get '/testing' => 'static#testing'
end
