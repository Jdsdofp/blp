import { Authenticated, Refine, useTitle } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { name } from '../package.json'


import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp, ConfigProvider, Typography } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import moment from "moment-timezone";
import { API_URL, authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryEdit,
  DocumentList,
  DocumentShow,
  ShowDocs,
} from "./pages/categories";
import ptBR from 'antd/es/locale/pt_BR';
import 'dayjs/locale/pt-br'
import { UpdatePassword } from "./pages/updatePassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { resources } from "./config/resources";
import { AdmUserShow } from "./pages/adm/user/show";
import { AdmUserlist } from "./pages/adm/user/list";
import { dataProvider } from "./contexts/providerData";
import { AdmUserCreate } from "./pages/adm/user";
import { AdmUserEdit } from "./pages/adm/user/edit";
import { AdmCompanyCreate } from "./pages/adm/company/create";
import { AdmBranchlist } from "./pages/adm/branch/list";
import { DocTypeDocCreate } from "./pages/documents/typeDocument/list";
import { ListCondition } from "./pages/documents/conditinals/list";
import { CreateCondition } from "./pages/documents/conditinals/create";
import { CalendarList } from "./pages/calendar/list";
import { Mapsall } from "./pages/maps/list";


type Props = {
  resource: String;
  action: String;
  params: Number;
}

function App() {
  const customTitleHandler = ({ resource, action, params }: Props) => {
    let title = String(name).toUpperCase(); // Título padrão
  
    if (resource && action) {
      // Verifique e formate as propriedades para garantir que sejam strings
      const idString = params && params?.id ? String(params.id) : "";
      const num = idString.length > 0 ? `(${idString})` : "";
      const bar = idString.length > 0 ? " " : "";

      title = `${resource?.meta?.label }${bar}${num} | ${title}`.trim(); // Gera o título dinamicamente
    }
  
    return title;
  };
  moment.tz.setDefault("America/Sao_Paulo");
  


  return (
    <BrowserRouter>
      <RefineKbarProvider>
        
        <ColorModeContextProvider>
        <ConfigProvider 
            locale={ptBR}
            theme={{
              components: {
                Button: {
                  borderRadius: 10,
                },
                Input: {
                  borderRadius: 10
                },
                Typography: {
                  colorTextHeading: "#AD8DF2"
                },
              },
              token: {
                colorPrimary: "#8B41F2",
              },
            }}
            >
          <AntdApp>

              <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={resources}
                options={{
                  title: {text: "BLP"},
                  liveMode: "auto",
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "YlYRK1-rzMtIe-TQIzAq",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={(props) => 
                          
                          <ThemedSiderV2
                           
                          {...props} 
                          fixed
                         
                          render={({items, collapsed})=>{ 
                            return(
                              <>
                                {items}
                              </>
                            )
                          }} />
                          
                        }
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="document" />}
                    />
                    <Route path="/blog-posts">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/document">
                      <Route index element={<DocumentList />} />
                      <Route path="edit/:id" element={<CategoryEdit />} />
                      <Route path="show" element={<DocumentShow />} />
                      <Route path="alldocuments/:id" element={<ShowDocs />}/>
                    </Route>
                    
                    <Route path="/mapsall">
                        <Route index element={<Mapsall />} />
                    </Route>

                    <Route path="/calendario">
                      <Route index element={<CalendarList/>} />
                    </Route>
                    
                    <Route path="/adm/company">
                      <Route index element={<AdmCompanyCreate />} />
                    </Route>

                    <Route path="/adm/branch">
                      <Route index element={<AdmBranchlist/>}></Route>
                    </Route>

                    <Route path="/adm/users" >
                      <Route index element={<AdmUserShow/>}/>
                      <Route  path="create" element={<AdmUserCreate />} />
                      <Route path="list" element={<AdmUserlist />}/>
                      <Route path="edit/:id" element={<AdmUserEdit/>}/>
                    </Route>

                    <Route path="/documents/type-documents">
                      <Route index element={<DocTypeDocCreate/>}></Route>
                    </Route>
                    
                    <Route path="/documents/conditionals">
                      <Route  index element={<ListCondition />} />
                      <Route path="list" element={<CreateCondition />}/>
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/update-password/:refreshToken/:id"
                      element={<UpdatePassword />}
                    />
                  </Route>
                </Routes>
                  

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler handler={customTitleHandler} />
              </Refine>
              
              
          </AntdApp>

        </ConfigProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
