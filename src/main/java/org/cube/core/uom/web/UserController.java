
package org.cube.core.uom.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.cube.core.uom.model.User;
import org.cube.core.uom.service.UserManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.gargoylesoftware.htmlunit.Page;

/**
 * @author macong
 */
@Controller
@RequestMapping(value = "/admin/user")
public class UserController {
    
    @Autowired
    private UserManager userManager;
    
    @RequestMapping(value = "")
    public String toListPage(Model model, @ModelAttribute("page") Page page) {
        model.addAttribute("pageInfo", page);
        return "sys/commons/uom/userList";
    }
    
    @RequestMapping(value = "pageData", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public Map<String, Object> pageData(Model model) {
        Map<String, Object> map = new HashMap<String, Object>();
        List<User> list = this.userManager.findAll();
        map.put("rows", list);
        map.put("results", list.size());
        return map;
    }
    
    @RequestMapping(value = "list", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public List<User> list(Model model) {
        return this.userManager.findAll();
    }
    
    /**
     * 删除用户
     * 
     * @param id
     * @param redirectAttributes
     * @return
     */
    @RequestMapping(value = "delete/{id}")
    @ResponseBody
    public int delete(@PathVariable("id") Long id, RedirectAttributes redirectAttributes) {
        this.userManager.delete(id);
        return 1;
    }
    
    @RequestMapping(value = "create")
    public String createForm(Model model) {
        User user = new User();
        user.setUserStatus(1);// 设置默认为可用
        model.addAttribute("user", user);
        return "sys/commons/uom/userForm";
    }
    
    @RequestMapping(value = "update/{id}")
    public String updateForm(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", this.userManager.find(id));
        return "sys/commons/uom/userForm";
    }
    
    @RequestMapping(value = "save")
    @ResponseBody
    public int save(@ModelAttribute("user") User user) {
        this.userManager.save(user);
        return 1;
    }
}
