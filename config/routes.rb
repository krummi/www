Eiriksson::Application.routes.draw do
  root 'static#index'

  get '/p2p' => 'static#p2p'
end
