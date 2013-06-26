
package org.cube.core.common.base;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.cube.core.common.base.helper.Compositor;
import org.cube.core.common.base.helper.ConditionQuery;
import org.cube.core.common.base.helper.Filtration;
import org.cube.core.common.base.helper.PageData;
import org.cube.core.common.utils.Reflections;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

/**
 * dao基类. 1：该类封装了最常见数据库操作的方法，你可以继承该类，添加自己喜欢的方法 2：当你有多个sessionFactory时，你也可以在你的子类中重写setSessionFactory()方法
 * 
 * @author yangzhibin
 * @param <T>实体类类型
 */
@SuppressWarnings("unchecked")
public class BaseDao<T extends BaseEntity> {
    
    protected Logger logger = LoggerFactory.getLogger(this.getClass());
    
    protected SessionFactory sessionFactory;
    
    protected Class<T> entityClass;
    
    /**
     * 构造方法
     */
    public BaseDao() {
        this.entityClass = Reflections.getSuperClassGenricType(this.getClass());
    }
    
    /**
     * 采用@Resource(name="xxx")按名称注入SessionFactory, 当有多个SesionFactory的时候Override本函数.
     */
    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }
    
    /**
     * 取得Session.
     */
    public Session getSession() {
        return this.sessionFactory.getCurrentSession();
    }
    
    // --------------------------------------------------------------------------------------------------
    
    /**
     * 新增对象.
     */
    public void save(T entity) {
        Assert.notNull(entity, "entity不能为空");
        entity.setInsertTime(new Date());// 插入时间
        this.getSession().save(entity);
        this.logger.debug("save entity: {}", entity);
    }
    
    /**
     * 获取记录总数
     */
    public long count() {
        return (Long) this.getSession().createQuery("select count(o) from " + this.entityClass.getSimpleName() + " o").list().get(0);
    }
    
    /**
     * 修改对象.
     */
    public void update(T entity) {
        Assert.notNull(entity, "entity不能为空");
        entity.setLastUpdateTime(new Date());// 最后一次修改时间
        this.getSession().update(entity);
        this.logger.debug("update entity: {}", entity);
    }
    
    /**
     * 删除对象.
     */
    public void delete(T entity) {
        Assert.notNull(entity, "entity不能为空");
        this.getSession().delete(entity);
        this.logger.debug("delete entity: {}", entity);
    }
    
    /**
     * 删除对象.
     */
    public void delete(long id) {
        this.delete(this.find(id));
        this.logger.debug("delete entity {},id is {}", this.entityClass.getSimpleName(), id);
    }
    
    /**
     * 对象显示.
     */
    public void visible(long id) {
        T entity = this.find(id);
        Assert.notNull(entity, "entity不能为空");
        if (!entity.isVisible()) {
            entity.setVisible(true);
            this.update(entity);
            this.logger.debug("visible entity {},id is {}", this.entityClass.getSimpleName(), id);
        }
    }
    
    /**
     * 对象不显示.
     */
    public void unVisible(long id) {
        T entity = this.find(id);
        Assert.notNull(entity, "entity不能为空");
        if (entity.isVisible()) {
            entity.setVisible(false);
            this.update(entity);
            this.logger.debug("unVisible entity {},id is {}", this.entityClass.getSimpleName(), id);
        }
        
    }
    
    /**
     * 按id获取对象.
     */
    public T find(long id) {
        Assert.notNull(id, "id不能为空");
        return (T) this.getSession().load(this.entityClass, id);
    }
    
    /**
     * 按属性查找唯一对象,匹配方式为相等.
     */
    public T find(String fieldName, Object fieldValue) {
        Assert.hasText(fieldName, "fieldName不能为空");
        Criterion criterion = Restrictions.eq(fieldName, fieldValue);
        return (T) ConditionQuery.createCriteria(this.getSession(), this.entityClass, criterion).uniqueResult();
    }
    
    /**
     * 按属性查找对象列表,匹配方式为相等.
     */
    public List<T> findList(String fieldName, Object fieldValue) {
        Assert.hasText(fieldName, "fieldName不能为空");
        Criterion criterion = Restrictions.eq(fieldName, fieldValue);
        return ConditionQuery.createCriteria(this.getSession(), this.entityClass, criterion).list();
    }
    
    /**
     * 按照过滤条件对象查找对象列表.
     */
    public List<T> findList(Filtration... filtrations) {
        Criteria criteria = ConditionQuery.createCriteria(this.getSession(), this.entityClass);
        // 设置过滤条件
        criteria = ConditionQuery.setFiltrationParameter(criteria, filtrations);
        return criteria.list();
    }
    
    /**
     * 按照过滤条件对象查找对象列表.
     */
    public List<T> findList(List<Filtration> filtrationList) {
        Criteria criteria = ConditionQuery.createCriteria(this.getSession(), this.entityClass);
        // 设置过滤条件
        criteria = ConditionQuery.setFiltrationParameter(criteria, filtrationList);
        return criteria.list();
    }
    
    /**
     * 按照过滤条件对象查找对象列表，支持排序.
     */
    public List<T> findList(Compositor compositor, Filtration... filtrations) {
        Criteria criteria = ConditionQuery.createCriteria(this.getSession(), this.entityClass);
        // 设置过滤条件
        criteria = ConditionQuery.setFiltrationParameter(criteria, filtrations);
        // 设置排序
        criteria = ConditionQuery.setCompositorParameter(criteria, compositor);
        return criteria.list();
    }
    
    /**
     * 按照过滤条件对象查找对象列表，支持排序.
     */
    public List<T> findList(Compositor compositor, List<Filtration> filtrationList) {
        Criteria criteria = ConditionQuery.createCriteria(this.getSession(), this.entityClass);
        // 设置过滤条件
        criteria = ConditionQuery.setFiltrationParameter(criteria, filtrationList);
        // 设置排序
        criteria = ConditionQuery.setCompositorParameter(criteria, compositor);
        return criteria.list();
    }
    
    /**
     * 获取全部对象.
     */
    public List<T> findAll() {
        return this.findList();
    }
    
    /**
     * 获取全部对象,支持排序.
     */
    public List<T> findAll(Compositor compositor) {
        return this.findList(compositor);
    }
    
    /**
     * 分页查询.
     */
    public PageData<T> find(PageData<T> pageData) {
        Assert.notNull(pageData, "pageData不能为空");
        Criteria criteria = ConditionQuery.createCriteria(this.getSession(), this.entityClass);
        ConditionQuery.setParameter(criteria, pageData);
        pageData.setResult(criteria.list());
        return pageData;
    }
    
    /**
     * 按id列表获取对象.
     */
    public List<T> findListByIds(List<Long> idList) {
        if (idList != null && idList.size() >= 1) {
            Criterion criterion = Restrictions.in("id", idList);
            return ConditionQuery.createCriteria(this.getSession(), this.entityClass, criterion).list();
        } else {
            return null;
        }
    }
    
    // --------------------------------------------------------------------------------------------------
    
    /**
     * 按HQL查询唯一对象.
     * 
     * @param hql "from Users where name=? and password=?"
     * @param values 数量可变的参数,按顺序绑定.
     * @return
     */
    public <X> X find(String hql, Object... values) {
        return (X) ConditionQuery.createQuery(this.getSession(), hql, values).uniqueResult();
    }
    
    /**
     * 按HQL查询唯一对象.
     * 
     * @param hql "from Users where name=:name and password=:password"
     * @param values 命名参数,按名称绑定.
     * @return
     */
    public <X> X find(String hql, Map<String, ?> values) {
        return (X) ConditionQuery.createQuery(this.getSession(), hql, values).uniqueResult();
    }
    
    /**
     * 按HQL查询对象列表.
     * 
     * @param hql "from Users where name=? and password=?"
     * @param values 数量可变的参数,按顺序绑定.
     * @return
     */
    public <X> List<X> findList(String hql, Object... values) {
        return ConditionQuery.createQuery(this.getSession(), hql, values).list();
    }
    
    /**
     * 按HQL查询对象列表.
     * 
     * @param hql "from Users where name=:name and password=:password"
     * @param values 命名参数,按名称绑定.
     * @return
     */
    public <X> List<X> findList(String hql, Map<String, ?> values) {
        return ConditionQuery.createQuery(this.getSession(), hql, values).list();
    }
    
    /**
     * 执行HQL进行批量修改/删除操作.
     * 
     * @return 更新记录数.
     */
    public int batchExecute(String hql, Object... values) {
        return ConditionQuery.createQuery(this.getSession(), hql, values).executeUpdate();
    }
    
    /**
     * 执行HQL进行批量修改/删除操作.
     * 
     * @return 更新记录数.
     */
    public int batchExecute(String hql, Map<String, ?> values) {
        return ConditionQuery.createQuery(this.getSession(), hql, values).executeUpdate();
    }
    
    // --------------------------------------------------------------------------------------------------
    
    /**
     * 本地SQL进行修改/删除操作
     * 
     * @return 更新记录数.
     */
    public List find(String sql) {
        Assert.hasText(sql, "sql不能为空");
        
        return this.getSession().createSQLQuery(sql).list();
    }
    
}
