import { ApartmentOutlined, BranchesOutlined, UserSwitchOutlined } from "@ant-design/icons";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import type { IResourceItem } from "@refinedev/core";

export const resources: IResourceItem[] = [
  {
    name: "blog_posts",
    list: "/blog-posts",
    create: "/blog-posts/create",
    edit: "/blog-posts/edit/:id",
    show: "/blog-posts/show/:id",
    meta: {
      canDelete: true,
      label: 'Painel',
      icon: <AvTimerIcon/>
    },
  },
  {
    name: "categories",
    list: "/categories",
    create: "/categories/create",
    edit: "/categories/edit/:id",
    show: "/categories/show/:id",
    meta: {
      canDelete: true,
      label: 'Documentos',
      icon: <ReceiptLongIcon/>
    },
  },
  {
    name: "administrations",
    list: "/adm",
    show: "/adm",
    meta:{
      label: "Administração",
      icon: <ApartmentOutlined />
    }
  },
  {
      name: "administrations",
      list: "/adm/company",
      meta: {
          parent: "administrations",
          label: "Empresa",
          icon: <AddBusinessIcon/>
      },
  },
  {
    name: "bracnhs",
    list: "/adm/branch",
    meta: {
      parent: "administrations",
      label: "Filial",
      icon: <BranchesOutlined/>
    }
  },
  {
    name: "users",
    list: "/adm/users",
    meta: {
      parent: "administrations",
      label: "Ususarios",
      icon: <UserSwitchOutlined/>
    }
  }
]