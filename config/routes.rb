Eiriksson::Application.routes.draw do

  resources :blogs, except: :show do |d|
  	patch '/publish' => 'blogs#publish'
  end

  root 'static#index'

  get '/p2p' => 'static#p2p'

  get '/:id', to: 'blogs#show', constraints: { id: /[a-zA-Z0-9\-]+/ }, as: 'short_blog'
end
