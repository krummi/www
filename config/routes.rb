Eiriksson::Application.routes.draw do
  resources :blogs

  root 'static#index'

  get '/p2p' => 'static#p2p'
end
